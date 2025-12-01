# Army Equipment Inventory Management System - User Guide

## Overview

This inventory management system automatically processes form responses and updates your gear inventory, checkout logs, and dashboard metrics.

## File Structure

- **Inventory Managment System.xlsx** - Main Excel file with all data
  - **Form Responses** - Input sheet with form data
  - **gear_inventory** - Current status of all equipment
  - **checkout_log** - Transaction history
  - **dashboard** - Auto-calculating metrics and KPIs
  - **users** - User information
  - **checkout_checkin_form** - Form template

- **update_inventory.py** - Main script to process form responses
- **setup_dashboard_formulas.py** - One-time setup for dashboard formulas

## How It Works

### 1. Form Responses Sheet

When a form is submitted (Google Forms, Microsoft Forms, etc.), a new row is added to the "Form Responses" sheet with:

- Timestamp
- S4/AS4 Name and Email (person processing)
- Transaction Type (CHECK-OUT or CHECK-IN)
- Equipment Serial Number (format: "SN-XXX-### - Item Description")
- Soldier information (ID, Name, Email)
- Dates (checkout/check-in date, due date)
- Equipment condition
- Notes

### 2. Processing Transactions

Run the update script to process new form responses:

```bash
python3 update_inventory.py
```

**What the script does:**

#### For CHECK-OUT transactions:
- Updates gear_inventory: Sets status to "Checked Out", assigns Current User, sets Due Date
- Adds new transaction to checkout_log with status "Active"
- Automatically marks as "Overdue" if past due date

#### For CHECK-IN transactions:
- Updates gear_inventory: Changes status based on equipment condition
  - Excellent/Good → "Available"
  - Damaged/Needs Repair → "In Maintenance"
- Updates checkout_log: Adds check-in date, changes status to "Completed"

### 3. Dashboard Auto-Updates

The dashboard sheet uses Excel formulas to automatically calculate metrics:

| Metric | Description | Formula |
|--------|-------------|---------|
| Total Gear Items | Count of all equipment | COUNTA of serial numbers |
| Available Items | Items ready for checkout | COUNTIF status = "Available" |
| Checked Out Items | Currently checked out | COUNTIF status = "Checked Out" |
| Overdue Items | Checked out past due date | SUMPRODUCT with date comparison |
| Items in Maintenance | Being repaired | COUNTIF status = "In Maintenance" |
| Lost Items | Missing equipment | COUNTIF status = "Lost" |
| Total Users | Unique users in system | COUNT of unique names |
| Active Checkouts | Current active transactions | COUNT of Active/Overdue status |
| Total Transactions | All-time transactions | COUNT of all transactions |
| Completed Transactions | Returned items | COUNT of Completed status |
| Utilization Rate | % of gear checked out | Checked Out / Total |
| Overdue Rate | % of checkouts overdue | Overdue / Checked Out |

**The dashboard updates automatically when you open the Excel file or when data changes!**

## Usage Workflow

### Option 1: Manual Processing (Recommended for control)

1. Form submissions populate "Form Responses" sheet
2. Review new entries for accuracy
3. Run: `python3 update_inventory.py`
4. Open Excel file to see updated data and metrics

### Option 2: Automated Processing (Advanced)

Set up a scheduled task (cron job on Linux, Task Scheduler on Windows):

```bash
# Run every hour
0 * * * * cd /path/to/InventoryManagement && python3 update_inventory.py
```

### Option 3: One-Time Batch Processing

If you have multiple form responses accumulated:
1. All form responses will be processed in order
2. Script prevents duplicate processing of same serial number in single run
3. Dashboard automatically recalculates all metrics

## Equipment Serial Number Format

**Important:** Equipment must be specified in this format:

```
SN-XXX-### - Item Description
```

Examples:
- `SN-ACU-002 - Army Combat Uniform (OCP) Large-Long`
- `SN-BOOT-001 - Combat Boots Size 10`
- `SN-RUCK-001 - MOLLE II Rucksack`

The script will:
- Extract serial number (SN-XXX-###)
- Extract item name (Item Description)
- Match with existing gear inventory

## Equipment Status Values

| Status | Meaning |
|--------|---------|
| Available | Ready for checkout |
| Checked Out | Currently issued to soldier |
| In Maintenance | Being repaired/serviced |
| Lost | Missing/unaccounted for |

## Troubleshooting

### Dashboard shows #REF! errors
**Solution:** Run `python3 setup_dashboard_formulas.py` to reset formulas

### Script says "X form response(s) to process" but nothing updates
**Possible causes:**
- Serial number format incorrect
- Serial number not in gear_inventory sheet
- Serial number already processed

**Solution:** Check Form Responses sheet format and gear_inventory for matching serial numbers

### Duplicate transactions appearing
**Cause:** Script run multiple times on same form data

**Solution:** Clear duplicate entries from checkout_log or clear processed form responses

### Overdue items not showing correctly
**Cause:** Date format issues or timezone differences

**Solution:** Ensure dates are in proper Excel date format (YYYY-MM-DD HH:MM:SS)

## Maintenance Tasks

### Adding New Equipment
1. Add to gear_inventory sheet with:
   - Serial Number (SN-XXX-###)
   - Item Name
   - Category
   - Shop Location
   - Status = "Available"
   - Current User = (blank)
   - Due Date = (blank)

### Removing Equipment
1. Change status to "Lost" or "Decommissioned"
2. Do not delete rows (preserves historical data)

### Clearing Old Form Responses
1. After processing, you can delete or archive old form response rows
2. Keep at least recent 30 days for audit trail

### Resetting Dashboard Formulas
If dashboard stops auto-calculating:
```bash
python3 setup_dashboard_formulas.py
```

## Data Backup

**Important:** Always backup before running updates!

```bash
# Create backup
cp "Inventory Managment System.xlsx" "Inventory_Backup_$(date +%Y%m%d).xlsx"

# Then run update
python3 update_inventory.py
```

## Technical Requirements

- Python 3.6+
- Required packages: `openpyxl`, `pandas`, `numpy`
- Install: `pip install openpyxl pandas numpy`

## Support & Customization

### Modifying Metrics
Edit `setup_dashboard_formulas.py` to add/modify dashboard metrics

### Changing Processing Logic
Edit `update_inventory.py` functions:
- `process_checkout()` - Customize checkout logic
- `process_checkin()` - Customize check-in logic
- `update_dashboard()` - Modify metric calculations

### Adding New Sheets
Excel file can have additional sheets without affecting the scripts

## Security Notes

- Form Responses contains PII (names, emails)
- Restrict file permissions appropriately
- Regular backups recommended
- Consider archiving old data periodically

## Version History

- **v1.0** (2025-12-01) - Initial automated system
  - Form processing script
  - Auto-calculating dashboard
  - CHECK-OUT and CHECK-IN support
