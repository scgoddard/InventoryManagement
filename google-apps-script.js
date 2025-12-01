/**
 * Army Equipment Inventory Management System - Google Apps Script
 * This script manages gear check-out/check-in through Google Forms
 * and auto-populates data into Google Sheets
 */

// Configuration - Update these sheet names to match your Google Sheets
const CONFIG = {
  GEAR_SHEET: 'Gear Inventory',
  USERS_SHEET: 'Users',
  CHECKOUT_LOG_SHEET: 'Check-Out Log',
  FORM_RESPONSES_SHEET: 'Form Responses',
  DASHBOARD_SHEET: 'Dashboard'
};

/**
 * Get all available gear items from inventory
 * @returns {Array} Array of available gear objects
 */
function getAvailableGear() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gearSheet = ss.getSheetByName(CONFIG.GEAR_SHEET);
  const data = gearSheet.getDataRange().getValues();

  const availableGear = [];
  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    const status = data[i][4]; // Status column
    if (status === 'Available') {
      availableGear.push({
        serialNumber: data[i][0],
        itemName: data[i][1],
        category: data[i][2],
        shopLocation: data[i][3],
        displayName: `${data[i][1]} (${data[i][0]})`
      });
    }
  }
  return availableGear;
}

/**
 * Get gear due date if currently checked out
 * @param {string} serialNumber - The serial number of the gear
 * @returns {Date|null} Due date or null if available
 */
function getGearDueDate(serialNumber) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gearSheet = ss.getSheetByName(CONFIG.GEAR_SHEET);
  const data = gearSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === serialNumber) {
      const status = data[i][4];
      const dueDate = data[i][6];

      if (status === 'Available') {
        return null; // Available now
      } else if (dueDate) {
        return new Date(dueDate);
      }
    }
  }
  return null;
}

/**
 * Check if gear is available for checkout
 * @param {string} serialNumber - The serial number of the gear
 * @returns {Object} Availability status and message
 */
function checkGearAvailability(serialNumber) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gearSheet = ss.getSheetByName(CONFIG.GEAR_SHEET);
  const data = gearSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === serialNumber) {
      const status = data[i][4];
      const dueDate = data[i][6];
      const currentUser = data[i][5];

      switch(status) {
        case 'Available':
          return { available: true, message: 'Available for checkout' };
        case 'Checked Out':
          return {
            available: false,
            message: `Checked out to ${currentUser}, due back ${dueDate}`
          };
        case 'Overdue':
          return {
            available: false,
            message: `Overdue - Currently with ${currentUser}`
          };
        case 'Maintenance':
          return {
            available: false,
            message: 'Currently in maintenance'
          };
        case 'Lost':
          return {
            available: false,
            message: 'Reported as lost'
          };
        default:
          return { available: false, message: 'Status unknown' };
      }
    }
  }
  return { available: false, message: 'Gear not found' };
}

/**
 * Calculate earliest available checkout date for gear
 * @param {string} serialNumber - The serial number of the gear
 * @returns {Date} Earliest available date
 */
function getEarliestAvailableDate(serialNumber) {
  const dueDate = getGearDueDate(serialNumber);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!dueDate) {
    return today; // Available now
  }

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  if (due < today) {
    return today; // Overdue, but treat as today
  }

  // Add one day buffer after return
  due.setDate(due.getDate() + 1);
  return due;
}

/**
 * Process form submission for check-out
 * This function runs automatically when the form is submitted
 */
function onFormSubmit(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const formSheet = ss.getSheetByName(CONFIG.FORM_RESPONSES_SHEET);
  const gearSheet = ss.getSheetByName(CONFIG.GEAR_SHEET);
  const logSheet = ss.getSheetByName(CONFIG.CHECKOUT_LOG_SHEET);

  // Get form response values
  const response = e.values;
  const timestamp = response[0];
  const ncoName = response[1];
  const ncoEmail = response[2];
  const transactionType = response[3]; // CHECK-OUT or CHECK-IN
  const serialNumber = response[4];
  const userId = response[5];
  const userName = response[6];
  const userEmail = response[7];
  const checkoutDate = response[8];
  const dueDate = response[9];
  const condition = response[10];
  const notes = response[11];

  if (transactionType === 'CHECK-OUT') {
    processCheckOut(serialNumber, userId, userName, checkoutDate, dueDate);
  } else if (transactionType === 'CHECK-IN') {
    processCheckIn(serialNumber, userId, userName, checkoutDate, condition);
  }

  // Update dashboard metrics
  updateDashboard();

  // Generate digital hand receipt
  generateHandReceipt(response);
}

/**
 * Process check-out transaction
 */
function processCheckOut(serialNumber, userId, userName, checkoutDate, dueDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gearSheet = ss.getSheetByName(CONFIG.GEAR_SHEET);
  const logSheet = ss.getSheetByName(CONFIG.CHECKOUT_LOG_SHEET);

  // Update gear inventory status
  const gearData = gearSheet.getDataRange().getValues();
  const itemName = updateGearStatus(serialNumber, 'Checked Out', userName, dueDate);

  // Add to checkout log
  const transactionId = generateTransactionId();
  const newLog = [
    transactionId,
    serialNumber,
    itemName,
    userName,
    checkoutDate,
    dueDate,
    '', // No check-in date yet
    'Active'
  ];

  logSheet.appendRow(newLog);
}

/**
 * Process check-in transaction
 */
function processCheckIn(serialNumber, userId, userName, checkinDate, condition) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName(CONFIG.CHECKOUT_LOG_SHEET);

  // Update gear inventory status
  const newStatus = (condition === 'Damaged' || condition === 'Poor') ? 'Maintenance' : 'Available';
  updateGearStatus(serialNumber, newStatus, '', '');

  // Update checkout log
  const logData = logSheet.getDataRange().getValues();
  for (let i = logData.length - 1; i >= 1; i--) {
    if (logData[i][1] === serialNumber && logData[i][7] === 'Active') {
      logSheet.getRange(i + 1, 7).setValue(checkinDate); // Check-in date
      logSheet.getRange(i + 1, 8).setValue('Completed'); // Status
      break;
    }
  }
}

/**
 * Update gear status in inventory
 */
function updateGearStatus(serialNumber, status, currentUser, dueDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gearSheet = ss.getSheetByName(CONFIG.GEAR_SHEET);
  const data = gearSheet.getDataRange().getValues();

  let itemName = '';
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === serialNumber) {
      itemName = data[i][1];
      gearSheet.getRange(i + 1, 5).setValue(status); // Status
      gearSheet.getRange(i + 1, 6).setValue(currentUser); // Current User
      gearSheet.getRange(i + 1, 7).setValue(dueDate); // Due Date
      break;
    }
  }
  return itemName;
}

/**
 * Generate unique transaction ID
 */
function generateTransactionId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName(CONFIG.CHECKOUT_LOG_SHEET);
  const lastRow = logSheet.getLastRow();
  const txnNumber = lastRow.toString().padStart(3, '0');
  return `TXN-${txnNumber}`;
}

/**
 * Update dashboard metrics
 */
function updateDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gearSheet = ss.getSheetByName(CONFIG.GEAR_SHEET);
  const logSheet = ss.getSheetByName(CONFIG.CHECKOUT_LOG_SHEET);
  const dashSheet = ss.getSheetByName(CONFIG.DASHBOARD_SHEET);

  const gearData = gearSheet.getDataRange().getValues();
  const logData = logSheet.getDataRange().getValues();

  // Calculate metrics
  let available = 0, checkedOut = 0, overdue = 0, maintenance = 0, lost = 0;
  const today = new Date();

  for (let i = 1; i < gearData.length; i++) {
    const status = gearData[i][4];
    switch(status) {
      case 'Available': available++; break;
      case 'Checked Out':
        const dueDate = new Date(gearData[i][6]);
        if (dueDate < today) {
          overdue++;
        } else {
          checkedOut++;
        }
        break;
      case 'Overdue': overdue++; break;
      case 'Maintenance': maintenance++; break;
      case 'Lost': lost++; break;
    }
  }

  const totalItems = gearData.length - 1;
  const activeCheckouts = checkedOut + overdue;
  const utilizationRate = ((activeCheckouts / totalItems) * 100).toFixed(2) + '%';
  const overdueRate = ((overdue / activeCheckouts) * 100).toFixed(2) + '%';

  // Update dashboard
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  dashSheet.getRange('B1').setValue(totalItems);
  dashSheet.getRange('B2').setValue(available);
  dashSheet.getRange('B3').setValue(checkedOut);
  dashSheet.getRange('B4').setValue(overdue);
  dashSheet.getRange('B5').setValue(maintenance);
  dashSheet.getRange('B6').setValue(lost);
  dashSheet.getRange('B8').setValue(activeCheckouts);
  dashSheet.getRange('B11').setValue(utilizationRate);
  dashSheet.getRange('B12').setValue(overdueRate);
}

/**
 * Generate digital hand receipt
 */
function generateHandReceipt(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const receiptSheet = ss.getSheetByName('Hand Receipts') || ss.insertSheet('Hand Receipts');

  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  const receipt = [
    timestamp,
    formData[1], // NCO Name
    formData[3], // Transaction Type
    formData[4], // Serial Number
    formData[6], // User Name
    formData[7], // User Email
    formData[8], // Date
    formData[9], // Due Date
    formData[10], // Condition
    formData[11], // Notes
    'DIGITAL RECEIPT'
  ];

  receiptSheet.appendRow(receipt);
}

/**
 * Create custom menu in Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Army Inventory System')
    .addItem('Check Gear Availability', 'showAvailabilityDialog')
    .addItem('Update Dashboard', 'updateDashboard')
    .addItem('Generate Overdue Report', 'generateOverdueReport')
    .addSeparator()
    .addItem('Setup Form Trigger', 'createFormTrigger')
    .addToUi();
}

/**
 * Show dialog with available gear
 */
function showAvailabilityDialog() {
  const availableGear = getAvailableGear();
  let message = 'AVAILABLE GEAR:\\n\\n';

  availableGear.forEach(gear => {
    message += `• ${gear.itemName} (${gear.serialNumber}) - ${gear.shopLocation}\\n`;
  });

  const ui = SpreadsheetApp.getUi();
  ui.alert('Available Gear', message, ui.ButtonSet.OK);
}

/**
 * Generate overdue report
 */
function generateOverdueReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gearSheet = ss.getSheetByName(CONFIG.GEAR_SHEET);
  const data = gearSheet.getDataRange().getValues();
  const today = new Date();

  let overdueItems = [];
  for (let i = 1; i < data.length; i++) {
    const status = data[i][4];
    const dueDate = new Date(data[i][6]);

    if ((status === 'Checked Out' || status === 'Overdue') && dueDate < today) {
      overdueItems.push({
        serial: data[i][0],
        item: data[i][1],
        user: data[i][5],
        dueDate: Utilities.formatDate(dueDate, Session.getScriptTimeZone(), 'yyyy-MM-dd')
      });
    }
  }

  let message = 'OVERDUE ITEMS:\\n\\n';
  if (overdueItems.length === 0) {
    message += 'No overdue items!';
  } else {
    overdueItems.forEach(item => {
      message += `• ${item.item} (${item.serial})\\n  User: ${item.user}\\n  Due: ${item.dueDate}\\n\\n`;
    });
  }

  const ui = SpreadsheetApp.getUi();
  ui.alert('Overdue Report', message, ui.ButtonSet.OK);
}

/**
 * Create form submission trigger
 * Run this once to set up automatic processing
 */
function createFormTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();

  SpreadsheetApp.getUi().alert('Form trigger created successfully!');
}
