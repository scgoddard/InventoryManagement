# Army Equipment Check-Out/Check-In System - NCO User Guide

## Quick Reference for Supply Shop NCOs

This guide explains how to use the digital equipment management form to process check-out and check-in transactions for soldiers.

---

## Accessing the Form

1. **Bookmark the Form Link** - Save the Google Form link provided by your administrator
2. **No Login Required** - Form can be accessed directly (if configured for your unit)
3. **Mobile Friendly** - Works on computers, tablets, and smartphones

---

## Processing a CHECK-OUT

### Step-by-Step Instructions:

**1. Open the Form**
   - Click on the saved bookmark or form link

**2. Enter Your Information (NCO Section)**
   - **Your Name**: Enter your full name with rank
     - Example: `SSG David Thompson`
   - **Your Email**: Enter your army.mil email address
     - Example: `david.thompson@army.mil`

**3. Select Transaction Type**
   - Choose: **CHECK-OUT**

**4. Select Equipment**
   - **Equipment Serial Number**: Open the dropdown menu
   - Select the item the soldier needs
   - The dropdown shows: Serial Number - Item Description
   - Example: `SN-ACU-001 - Army Combat Uniform (OCP) Medium-Regular`

   > **TIP**: Only available items should appear in the list. If an item is missing, it may be checked out or in maintenance.

**5. Enter Soldier Information**
   - **Soldier User ID**: Select from dropdown
     - Example: `U001`
   - **Soldier Name**: Enter full name with rank
     - Example: `SGT James Mitchell`
   - **Soldier Email**: Enter their army.mil email
     - Example: `james.mitchell@army.mil`

**6. Set Dates**
   - **Checkout Date**: Select today's date (or transaction date)
   - **Due Date**: Select when equipment must be returned
     - Consider mission length, training schedule, etc.
     - Standard periods: 7 days, 14 days, 30 days

**7. Assess Equipment Condition**
   - Select current condition before check-out:
     - **Excellent** - Like new, no wear
     - **Good** - Minor wear, fully functional
     - **Fair** - Some wear, still serviceable
     - **Poor** - Significant wear, needs attention soon
     - **Damaged** - Needs immediate repair

**8. Add Notes (Optional)**
   - Enter any relevant information:
     - Purpose of checkout
     - Special instructions
     - Training event details
     - Example: `Issued for field training exercise at Fort Benning`

**9. Submit**
   - Click **Submit** button
   - Wait for confirmation message
   - Confirmation appears: "Transaction recorded successfully. Digital hand receipt has been generated."

---

## Processing a CHECK-IN

### Step-by-Step Instructions:

**1. Open the Form**
   - Same form link as check-out

**2. Enter Your Information (NCO Section)**
   - Your Name (with rank)
   - Your Email (army.mil)

**3. Select Transaction Type**
   - Choose: **CHECK-IN**

**4. Select Equipment Being Returned**
   - **Equipment Serial Number**: Open dropdown
   - Select the item being returned
   - Example: `SN-ACU-001 - Army Combat Uniform (OCP) Medium-Regular`

**5. Enter Soldier Information**
   - **Soldier User ID**: Select from dropdown
   - **Soldier Name**: Enter name with rank
   - **Soldier Email**: Enter army.mil email

   > **NOTE**: This should match the soldier who originally checked out the item

**6. Set Return Date**
   - **Checkout/Check-In Date**: Select today's date
   - **Due Date**: Leave blank for check-ins

**7. Inspect and Assess Equipment Condition**
   - **IMPORTANT**: Physically inspect the equipment before selecting condition
   - Select returned condition:
     - **Excellent** - Returned in perfect condition
     - **Good** - Minor wear from use, acceptable
     - **Fair** - Noticeable wear, still serviceable
     - **Poor** - Excessive wear, needs maintenance soon
     - **Damaged** - Requires repair before next issue

   > **AUTOMATIC ACTION**: Items marked "Poor" or "Damaged" are automatically flagged for maintenance

**8. Document Any Issues (Important)**
   - Use Notes section to document:
     - Any damage found
     - Missing components
     - Cleaning needed
     - Repair requirements
     - Example: `Left boot has loose sole, requires cobbler repair`

**9. Submit**
   - Click **Submit**
   - Wait for confirmation
   - Equipment status automatically updates to "Available" or "Maintenance"

---

## Understanding Equipment Status

The system tracks equipment in these statuses:

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| **Available** | Ready to issue | None - can be checked out |
| **Checked Out** | Currently with a soldier | Track due date |
| **Overdue** | Past due date, not returned | Contact soldier, initiate return |
| **Maintenance** | Needs repair | Send to maintenance, do not issue |
| **Lost** | Reported missing | Initiate investigation, FLIPL if needed |

---

## Checking Equipment Availability

### Method 1: Using the Form
- Open the Equipment Serial Number dropdown
- Only available items appear in the list
- If item is missing from dropdown, it's not available

### Method 2: Using Google Sheets
1. Open the "Army Equipment Inventory System" spreadsheet
2. Go to **Gear Inventory** sheet
3. Check the **Status** column
4. Look for items marked "Available"

### Method 3: Using Custom Menu
1. Open the Google Sheets spreadsheet
2. Click **Army Inventory System** menu
3. Select **Check Gear Availability**
4. View popup list of all available items

---

## Common Scenarios

### Scenario 1: Soldier Needs Uniform for Training
**Action**: Process CHECK-OUT
- Select uniform serial number
- Set due date after training ends
- Note: "Issued for FTX, 3-7 DEC"

### Scenario 2: Equipment Returned On Time
**Action**: Process CHECK-IN
- Inspect equipment condition
- Select appropriate condition
- If excellent/good, equipment becomes available immediately

### Scenario 3: Equipment Returned Damaged
**Action**: Process CHECK-IN with documentation
- Select "Damaged" or "Poor" condition
- Document damage in Notes field
- Equipment automatically goes to "Maintenance" status
- Follow unit procedures for repair/replacement

### Scenario 4: Overdue Equipment
**Check Dashboard**:
1. Open Google Sheets
2. View **Dashboard** sheet
3. Check "Overdue Items" count
4. Use "Generate Overdue Report" from menu
5. Contact soldiers with overdue items

### Scenario 5: Equipment Not in Dropdown
**Possible Reasons**:
- Already checked out to someone else
- In maintenance status
- Marked as lost
- Check **Gear Inventory** sheet for details

---

## Digital Hand Receipts

### What They Are
- Automatically generated electronic records
- Stored in **Hand Receipts** sheet
- Include all transaction details
- Timestamped and NCO-attributed

### How to Access
1. Open the Google Sheets spreadsheet
2. Go to **Hand Receipts** sheet
3. Find transaction by date or soldier name
4. Can be printed or emailed if needed

### What They Include
- Transaction timestamp
- NCO name and email (you)
- Transaction type (check-out or check-in)
- Equipment details
- Soldier information
- Dates and condition
- Notes

---

## Dashboard Metrics

### Understanding the Dashboard

Access: **Dashboard** sheet in Google Sheets

**Key Metrics**:
- **Total Gear Items** - Complete inventory count
- **Available Items** - Ready to issue now
- **Checked Out Items** - Currently with soldiers
- **Overdue Items** - Past due date (ACTION REQUIRED)
- **Items in Maintenance** - Being repaired
- **Lost Items** - Reported missing
- **Utilization Rate** - Percentage of gear in use
- **Overdue Rate** - Percentage of active checkouts that are overdue

### Using Metrics for Management
- **High Utilization** (>80%): Consider requesting more inventory
- **High Overdue Rate** (>15%): Increase soldier follow-up
- **Many in Maintenance**: Review equipment quality, durability
- **Lost Items**: Investigate, process FLIPL as required

---

## Best Practices

### Before Check-Out
✓ Verify soldier identity and authorization
✓ Physically inspect equipment condition
✓ Confirm equipment functionality (zippers, buttons, etc.)
✓ Set realistic due dates based on mission requirements
✓ Photograph high-value items (optional but recommended)

### During Check-Out
✓ Enter accurate soldier information
✓ Double-check serial numbers
✓ Explain return procedures to soldier
✓ Provide due date reminder
✓ Document any existing damage in Notes

### Before Check-In
✓ Physically inspect returned equipment
✓ Check for all components (if applicable)
✓ Verify condition honestly (don't overlook damage)
✓ Clean equipment if required by SOP
✓ Document any issues for accountability

### After Check-In
✓ Confirm equipment returned to proper storage location
✓ Verify system shows "Available" status (if good condition)
✓ Flag maintenance items for repair
✓ Update soldier on any issues found

### Daily Operations
✓ Check dashboard for overdue items each morning
✓ Contact soldiers 2-3 days before due date (courtesy reminder)
✓ Process returns promptly to maintain availability
✓ Keep storage areas organized by serial number
✓ Review weekly utilization metrics

---

## Troubleshooting

### Form Won't Submit
- Check all required fields are filled
- Verify email addresses include @army.mil
- Ensure dates are in correct format
- Try refreshing the page

### Equipment Not Showing in Dropdown
- Verify it's marked "Available" in Gear Inventory sheet
- Check if someone else has it checked out
- Confirm serial number exists in system

### Wrong Information Submitted
- **DO NOT** attempt to delete form responses
- Contact your system administrator
- They can edit entries in Google Sheets directly
- Process correcting transaction with notes explaining error

### System Not Updating
- Verify internet connection
- Check that form is properly linked to spreadsheet
- Contact administrator if issues persist
- Use manual update: Army Inventory System menu → Update Dashboard

---

## Contact Information

### For System Issues:
- Contact: [Your Unit System Administrator]
- Email: [admin.email@army.mil]

### For Equipment Issues:
- Supply Sergeant: [Name/Contact]
- Unit Supply Officer: [Name/Contact]

---

## Quick Tips

💡 **Speed Up Processing**: Bookmark the form on your computer and phone
💡 **Reduce Errors**: Keep a printed roster of User IDs handy
💡 **Stay Organized**: Process returns same-day to keep inventory current
💡 **Track Trends**: Review dashboard weekly to identify patterns
💡 **Prevent Overdue**: Send courtesy reminders 2 days before due dates
💡 **Document Everything**: Use Notes field liberally for accountability

---

## Form Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                     SUPPLY NCO OPENS FORM                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Enter NCO Information (Your Info)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Select Transaction│
                    │      Type        │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
      ┌──────────────┐              ┌──────────────┐
      │  CHECK-OUT   │              │  CHECK-IN    │
      └──────┬───────┘              └──────┬───────┘
             │                             │
             ▼                             ▼
    Select Equipment              Select Equipment
    Enter Soldier Info            Enter Soldier Info
    Set Checkout Date             Set Return Date
    Set Due Date                  Assess Condition
    Assess Condition              Document Issues
    Add Notes                     Add Notes
             │                             │
             └──────────────┬──────────────┘
                            ▼
                    ┌───────────────┐
                    │    SUBMIT     │
                    └───────┬───────┘
                            │
                            ▼
          ┌─────────────────────────────────────┐
          │  System Automatically:              │
          │  • Updates Gear Status              │
          │  • Records in Check-Out Log         │
          │  • Generates Digital Hand Receipt   │
          │  • Updates Dashboard Metrics        │
          └─────────────────────────────────────┘
```

---

**Remember**: Accurate record-keeping ensures accountability and availability. When in doubt, document thoroughly in the Notes field!

**HOOAH!**
