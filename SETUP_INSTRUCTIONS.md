# Army Equipment Inventory Management System - Setup Instructions

## Overview
This system allows Supply Shop NCOs to manage equipment check-out/check-in through Google Forms, with automatic updates to Google Sheets and digital hand receipts.

## Prerequisites
- Google Account with access to Google Drive
- Google Sheets
- Google Forms
- Basic understanding of Google Apps Script (optional, for customization)

---

## Step 1: Set Up Google Sheets

### 1.1 Create New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Army Equipment Inventory System"**

### 1.2 Import CSV Data
Create the following sheets by importing the CSV files:

**Sheet 1: Gear Inventory**
- Import `gear_inventory.csv`
- Rename sheet to: **Gear Inventory**

**Sheet 2: Users**
- Import `users.csv`
- Rename sheet to: **Users**

**Sheet 3: Check-Out Log**
- Import `checkout_log.csv`
- Rename sheet to: **Check-Out Log**

**Sheet 4: Dashboard**
- Import `dashboard.csv`
- Rename sheet to: **Dashboard**

**Sheet 5: Form Responses**
- Import `form_responses_template.csv`
- Rename sheet to: **Form Responses**

**Sheet 6: Hand Receipts**
- Import `hand_receipts.csv`
- Rename sheet to: **Hand Receipts**

---

## Step 2: Add Google Apps Script

### 2.1 Open Script Editor
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code in the editor
3. Copy all code from `google-apps-script.js`
4. Paste into the script editor
5. Click **Save** (disk icon)
6. Name the project: **"Army Inventory Manager"**

### 2.2 Set Up Trigger
1. In the Apps Script editor, click the **clock icon** (Triggers) in the left sidebar
2. Click **+ Add Trigger** (bottom right)
3. Configure:
   - Choose function: `onOpen`
   - Deployment: Head
   - Event source: From spreadsheet
   - Event type: On open
4. Click **Save**
5. Authorize the script when prompted

---

## Step 3: Create Google Form

### 3.1 Create New Form
1. Go to [Google Forms](https://forms.google.com)
2. Create a new form
3. Title: **"Army Equipment Check-Out/Check-In Form"**
4. Description: **"Supply Shop NCO: Use this form to process equipment transactions for soldiers"**

### 3.2 Configure Form Questions

**Question 1: NCO Information Section**
- Type: **Section Header**
- Title: **"Supply NCO Information"**
- Description: **"Enter your information as the NCO processing this transaction"**

**Question 2: Your Name (NCO)**
- Type: **Short answer**
- Question: **"Your Name (NCO Processing Form)"**
- Required: ✓
- Validation: Text contains "@" is NOT checked

**Question 3: Your Email (NCO)**
- Type: **Short answer**
- Question: **"Your Email (NCO)"**
- Required: ✓
- Validation: Text → Email address

**Question 4: User Information Section**
- Type: **Section Header**
- Title: **"Soldier Information"**
- Description: **"Enter information for the soldier checking out/in equipment"**

**Question 5: Transaction Type**
- Type: **Multiple choice**
- Question: **"Transaction Type"**
- Options:
  - CHECK-OUT
  - CHECK-IN
- Required: ✓

**Question 6: Equipment Serial Number**
- Type: **Dropdown**
- Question: **"Equipment Serial Number"**
- Options: (Copy from gear_inventory.csv - Serial Number column)
  - SN-ACU-001 - Army Combat Uniform (OCP) Medium-Regular
  - SN-ACU-002 - Army Combat Uniform (OCP) Large-Long
  - SN-ACU-003 - Army Combat Uniform (OCP) Small-Short
  - SN-BOOT-001 - Combat Boots Size 10
  - SN-BOOT-002 - Combat Boots Size 9
  - SN-BOOT-003 - Combat Boots Size 11
  - SN-CAP-001 - Patrol Cap OCP Medium
  - SN-CAP-002 - Patrol Cap OCP Large
  - SN-JKT-001 - ECWCS Parka Level 6 Medium
  - SN-JKT-002 - ECWCS Parka Level 6 Large
  - SN-BELT-001 - Rigger Belt Tan Medium
  - SN-GLV-001 - Combat Gloves Leather Medium
  - SN-GLV-002 - Combat Gloves Leather Large
  - SN-RUCK-001 - MOLLE II Rucksack Main Pack
  - SN-RUCK-002 - MOLLE II Rucksack Main Pack
- Required: ✓

**Question 7: Soldier User ID**
- Type: **Dropdown**
- Question: **"Soldier User ID"**
- Options: (Copy from users.csv)
  - U001
  - U002
  - U003
  - U004
  - U005
  - U006
  - U007
  - U008
- Required: ✓

**Question 8: Soldier Name**
- Type: **Short answer**
- Question: **"Soldier Name (with Rank)"**
- Required: ✓
- Example: "SGT James Mitchell"

**Question 9: Soldier Email**
- Type: **Short answer**
- Question: **"Soldier Email"**
- Required: ✓
- Validation: Text → Email address

**Question 10: Checkout Date**
- Type: **Date**
- Question: **"Checkout/Check-In Date"**
- Required: ✓

**Question 11: Due Date (Conditional)**
- Type: **Date**
- Question: **"Due Date (CHECK-OUT only)"**
- Required: Only if "CHECK-OUT" selected
- To set conditional:
  1. Click the three dots on this question
  2. Select "Go to section based on answer"
  3. Set to show only when Question 5 = "CHECK-OUT"

**Question 12: Equipment Condition**
- Type: **Multiple choice**
- Question: **"Equipment Condition"**
- Options:
  - Excellent
  - Good
  - Fair
  - Poor
  - Damaged
- Required: ✓

**Question 13: Notes**
- Type: **Paragraph**
- Question: **"Additional Notes/Comments"**
- Required: No

### 3.3 Form Settings
1. Click **Settings** (gear icon)
2. **General Tab:**
   - ✓ Collect email addresses
   - ✓ Limit to 1 response (unchecked - NCO will submit multiple)
   - ✓ Respondents can edit after submit (unchecked)
3. **Presentation Tab:**
   - ✓ Show progress bar
   - Confirmation message: **"Transaction recorded successfully. Digital hand receipt has been generated."**

---

## Step 4: Connect Form to Sheets

### 4.1 Link Form Responses
1. In your Google Form, click **Responses** tab
2. Click the green Sheets icon (top right)
3. Select **"Select existing spreadsheet"**
4. Choose your **"Army Equipment Inventory System"** sheet
5. Select the **"Form Responses"** sheet
6. Click **Select**

### 4.2 Verify Column Mapping
The form should populate columns in this order:
1. Timestamp
2. NCO Name
3. NCO Email
4. Transaction Type
5. Serial Number
6. User ID
7. User Name
8. User Email
9. Checkout Date
10. Due Date
11. Equipment Condition
12. Notes

---

## Step 5: Set Up Automated Processing

### 5.1 Activate Form Trigger
1. Go back to your Google Sheet
2. Click **Army Inventory System** menu (custom menu created by script)
3. Click **"Setup Form Trigger"**
4. Authorize if prompted
5. You should see: **"Form trigger created successfully!"**

### 5.2 Test the System
1. Open your Google Form
2. Submit a test CHECK-OUT transaction
3. Verify:
   - Response appears in **Form Responses** sheet
   - **Gear Inventory** sheet updates (Status changes to "Checked Out")
   - **Check-Out Log** sheet gets new entry
   - **Dashboard** metrics update
   - **Hand Receipts** sheet gets new digital receipt

---

## Step 6: Customize and Deploy

### 6.1 Update Dropdown Options
As you add new gear items:
1. Add to **Gear Inventory** sheet
2. Update Google Form Question 6 dropdown
3. Save form

### 6.2 Share Form with NCO
1. Click **Send** button in Google Form
2. Copy the link
3. Share with Supply Shop NCO
4. NCO can bookmark for quick access

### 6.3 Set Up Notifications (Optional)
1. In Google Sheets, click **Tools** → **Notification rules**
2. Choose: **"Notify me when... Any changes are made"**
3. Set email frequency: **"Right away"**

---

## How the System Works

### For CHECK-OUT:
1. NCO opens form and enters their information
2. NCO selects "CHECK-OUT" transaction type
3. NCO selects available equipment from dropdown
4. NCO enters soldier information
5. NCO sets checkout date and due date
6. System automatically:
   - Updates gear status to "Checked Out"
   - Records soldier as current user
   - Creates checkout log entry
   - Generates digital hand receipt
   - Updates dashboard metrics

### For CHECK-IN:
1. NCO opens form and enters their information
2. NCO selects "CHECK-IN" transaction type
3. NCO selects equipment being returned
4. NCO enters soldier information
5. NCO notes equipment condition
6. System automatically:
   - Updates gear status to "Available" (or "Maintenance" if damaged)
   - Clears current user field
   - Completes checkout log entry
   - Generates return receipt
   - Updates dashboard metrics

### Dynamic Availability:
- The Google Apps Script checks real-time availability
- Shows only available items in dropdown (can be enhanced)
- Prevents double-booking
- Calculates due dates based on current checkouts
- Flags overdue items automatically

---

## Useful Custom Menu Options

Once set up, the **"Army Inventory System"** menu provides:

- **Check Gear Availability** - View all currently available gear
- **Update Dashboard** - Manually refresh dashboard metrics
- **Generate Overdue Report** - See all overdue items and responsible soldiers
- **Setup Form Trigger** - Re-configure form automation if needed

---

## Troubleshooting

### Form not updating sheets
- Verify form is linked to correct sheet
- Check that trigger is set up (Step 5.1)
- Review Apps Script execution log for errors

### Gear not showing as available
- Check **Gear Inventory** sheet Status column
- Run "Check Gear Availability" from custom menu
- Verify status is exactly "Available" (case-sensitive)

### Digital receipts not generating
- Verify **Hand Receipts** sheet exists
- Check Apps Script permissions
- Review execution transcript for errors

### Dashboard not updating
- Run "Update Dashboard" from custom menu manually
- Verify dashboard formulas are not overwritten
- Check that all sheets have correct names

---

## Security & Best Practices

1. **Limit Form Access**: Share form link only with authorized NCOs
2. **Protect Sheets**: Set sheet permissions to prevent unauthorized editing
3. **Regular Backups**: Download copies periodically
4. **Audit Trail**: Form responses are timestamped and include NCO information
5. **Review Logs**: Periodically review Check-Out Log for discrepancies

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Google Apps Script execution logs (Extensions → Apps Script → Executions)
3. Verify all sheet names match exactly as specified
4. Ensure all required columns are present in each sheet

---

## Future Enhancements

Potential improvements:
- Email notifications to soldiers when equipment is due
- Automated overdue reminders
- QR code scanning for serial numbers
- Mobile-friendly form interface
- Integration with unit roster systems
- Advanced reporting and analytics

