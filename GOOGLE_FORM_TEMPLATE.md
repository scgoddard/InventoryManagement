# Google Form Template - Exact Configuration

## Form Title and Description

**Form Title**: `Army Equipment Check-Out/Check-In Form`

**Form Description**:
```
Supply Shop NCO: Use this form to process equipment transactions for soldiers.

This digital system will automatically:
• Update inventory status
• Create checkout/check-in records
• Generate digital hand receipts
• Update dashboard metrics

Complete all required fields accurately for proper accountability.
```

---

## Form Structure

### SECTION 1: Supply NCO Information

**Section Title**: `Supply NCO Information`
**Section Description**: `Enter your information as the NCO processing this transaction`

---

#### Question 1: NCO Name
- **Type**: Short answer
- **Question**: `Your Name (NCO Processing Form)`
- **Helper text**: `Enter your full name with rank (e.g., SSG David Thompson)`
- **Required**: ✓ Yes
- **Validation**: None

---

#### Question 2: NCO Email
- **Type**: Short answer
- **Question**: `Your Email (NCO)`
- **Helper text**: `Enter your army.mil email address`
- **Required**: ✓ Yes
- **Validation**: Text → Email address

---

### SECTION 2: Transaction Information

**Section Title**: `Transaction Information`
**Section Description**: `Select the type of transaction and equipment details`

---

#### Question 3: Transaction Type
- **Type**: Multiple choice
- **Question**: `Transaction Type`
- **Helper text**: `Select whether this is a check-out or check-in`
- **Required**: ✓ Yes
- **Options**:
  - ○ CHECK-OUT
  - ○ CHECK-IN

---

#### Question 4: Equipment Serial Number
- **Type**: Dropdown
- **Question**: `Equipment Serial Number`
- **Helper text**: `Select the equipment item for this transaction`
- **Required**: ✓ Yes
- **Options** (populate from gear_inventory.csv):

```
SN-ACU-001 - Army Combat Uniform (OCP) Medium-Regular
SN-ACU-002 - Army Combat Uniform (OCP) Large-Long
SN-ACU-003 - Army Combat Uniform (OCP) Small-Short
SN-BOOT-001 - Combat Boots Size 10
SN-BOOT-002 - Combat Boots Size 9
SN-BOOT-003 - Combat Boots Size 11
SN-CAP-001 - Patrol Cap OCP Medium
SN-CAP-002 - Patrol Cap OCP Large
SN-JKT-001 - ECWCS Parka Level 6 Medium
SN-JKT-002 - ECWCS Parka Level 6 Large
SN-BELT-001 - Rigger Belt Tan Medium
SN-GLV-001 - Combat Gloves Leather Medium
SN-GLV-002 - Combat Gloves Leather Large
SN-RUCK-001 - MOLLE II Rucksack Main Pack
SN-RUCK-002 - MOLLE II Rucksack Main Pack
```

**Enhancement Option**: Add data validation to show only "Available" items using Google Apps Script

---

### SECTION 3: Soldier Information

**Section Title**: `Soldier Information`
**Section Description**: `Enter information for the soldier checking out or returning equipment`

---

#### Question 5: Soldier User ID
- **Type**: Dropdown
- **Question**: `Soldier User ID`
- **Helper text**: `Select the soldier's User ID from the roster`
- **Required**: ✓ Yes
- **Options** (populate from users.csv):

```
U001
U002
U003
U004
U005
U006
U007
U008
```

---

#### Question 6: Soldier Name
- **Type**: Short answer
- **Question**: `Soldier Name (with Rank)`
- **Helper text**: `Enter full name with rank (e.g., SGT James Mitchell)`
- **Required**: ✓ Yes
- **Validation**: None

---

#### Question 7: Soldier Email
- **Type**: Short answer
- **Question**: `Soldier Email`
- **Helper text**: `Enter the soldier's army.mil email address`
- **Required**: ✓ Yes
- **Validation**: Text → Email address

---

### SECTION 4: Transaction Details

**Section Title**: `Transaction Details`
**Section Description**: `Provide dates and condition information`

---

#### Question 8: Checkout/Check-In Date
- **Type**: Date
- **Question**: `Checkout/Check-In Date`
- **Helper text**: `Select the date of this transaction (usually today)`
- **Required**: ✓ Yes
- **Validation**: None
- **Default**: Can set to "Today" if Google Forms allows

---

#### Question 9: Due Date
- **Type**: Date
- **Question**: `Due Date (CHECK-OUT only)`
- **Helper text**: `Select when equipment must be returned. Leave blank for CHECK-IN transactions.`
- **Required**: No (conditional - required only if CHECK-OUT)
- **Validation**: Date → Is after → [Reference to Question 8]
- **Conditional Logic**:
  - Show this question ONLY if Question 3 (Transaction Type) = "CHECK-OUT"

**To Set Conditional Display**:
1. Click the three dots (⋮) on this question
2. Select "Go to section based on answer"
3. Create branch: If Question 3 = CHECK-OUT → Show this question

---

#### Question 10: Equipment Condition
- **Type**: Multiple choice
- **Question**: `Equipment Condition`
- **Helper text**: `Inspect the equipment and select the current condition`
- **Required**: ✓ Yes
- **Options**:
  - ○ Excellent - Like new, no visible wear
  - ○ Good - Minor wear, fully functional
  - ○ Fair - Some wear, still serviceable
  - ○ Poor - Significant wear, needs attention soon
  - ○ Damaged - Requires repair

**Note for NCOs**: Items marked "Poor" or "Damaged" on CHECK-IN will automatically be flagged for maintenance

---

#### Question 11: Additional Notes
- **Type**: Paragraph
- **Question**: `Additional Notes/Comments`
- **Helper text**: `Enter any relevant details such as purpose, damage description, special instructions, etc.`
- **Required**: No
- **Validation**: None

**Example entries**:
- "Issued for field training exercise at Fort Benning, 5-10 DEC"
- "Returned with loose boot sole, sent to cobbler"
- "Standard issue for new arrival"

---

## Form Settings Configuration

### Settings → General

**Collect email addresses**: ☐ No
- NCO email is collected via form question instead

**Limit to 1 response**: ☐ No
- NCOs need to submit multiple transactions

**Respondents can edit after submit**: ☐ No
- Maintain accountability, no retroactive edits

**See summary charts and text responses**: ✓ Yes

---

### Settings → Presentation

**Show progress bar**: ✓ Yes

**Shuffle question order**: ☐ No

**Show link to submit another response**: ✓ Yes
- Allows NCO to quickly process multiple transactions

**Confirmation message**:
```
✓ Transaction recorded successfully!

Your equipment transaction has been processed and logged in the system.

• Inventory status has been updated
• Digital hand receipt has been generated
• Dashboard metrics have been refreshed

Thank you for maintaining accurate equipment accountability.

Click the link below to process another transaction.
```

---

### Settings → Quizzes

**Make this a quiz**: ☐ No

---

## Response Destination Setup

1. Click the **Responses** tab in Google Forms
2. Click the green Sheets icon (Create Spreadsheet)
3. Select **"Select existing spreadsheet"**
4. Choose: `Army Equipment Inventory System`
5. Select sheet: `Form Responses`
6. Click **Select**

**Expected Column Order in Sheet**:
| Column | Field |
|--------|-------|
| A | Timestamp |
| B | Your Name (NCO Processing Form) |
| C | Your Email (NCO) |
| D | Transaction Type |
| E | Equipment Serial Number |
| F | Soldier User ID |
| G | Soldier Name (with Rank) |
| H | Soldier Email |
| I | Checkout/Check-In Date |
| J | Due Date (CHECK-OUT only) |
| K | Equipment Condition |
| L | Additional Notes/Comments |

---

## Advanced Features (Optional)

### Dynamic Dropdown Population

To show only available equipment in the dropdown, use Google Apps Script:

```javascript
function updateFormDropdown() {
  const form = FormApp.openById('YOUR_FORM_ID');
  const availableGear = getAvailableGear(); // From main script

  const dropdownItem = form.getItemById('QUESTION_4_ID').asListItem();
  const choices = availableGear.map(gear => gear.displayName);
  dropdownItem.setChoiceValues(choices);
}
```

Run this function:
- On a time-based trigger (hourly)
- When inventory changes
- Before form is opened (requires published web app)

---

### Pre-fill User Information

Create a custom web interface that pre-fills soldier info when User ID is selected:

```javascript
function onUserIdSelect(userId) {
  const userInfo = getUserInfo(userId);
  // Auto-populate name and email fields
  return {
    name: userInfo.name,
    email: userInfo.email
  };
}
```

---

### Email Notifications

Add to the `onFormSubmit` function:

```javascript
function sendConfirmationEmail(formData) {
  const ncoEmail = formData[2];
  const soldierEmail = formData[7];
  const transactionType = formData[3];

  const subject = `Equipment ${transactionType} Confirmation`;
  const body = generateEmailBody(formData);

  MailApp.sendEmail(ncoEmail, subject, body);
  MailApp.sendEmail(soldierEmail, subject, body);
}
```

---

## Form URL and Distribution

**After Creating Form**:

1. Click **Send** button (top right)
2. Click link icon (🔗)
3. Check "Shorten URL" if desired
4. Copy link
5. Example: `https://forms.gle/xxxxxxxxxxxxx`

**Distribution Methods**:
- Bookmark on supply office computer
- Add to unit SharePoint/intranet
- Create QR code for mobile access
- Email to authorized NCOs
- Print QR code for supply room wall

---

## Testing Checklist

Before deploying to NCOs, test:

- ✓ Submit CHECK-OUT transaction
  - Verify Gear Inventory updates status to "Checked Out"
  - Verify Check-Out Log creates new entry
  - Verify Dashboard metrics update
  - Verify Hand Receipt is generated

- ✓ Submit CHECK-IN transaction
  - Verify Gear Inventory updates status to "Available"
  - Verify Check-Out Log entry is completed
  - Verify Dashboard metrics update
  - Verify Hand Receipt is generated

- ✓ Submit CHECK-IN with "Damaged" condition
  - Verify status changes to "Maintenance" (not "Available")
  - Verify item does not appear in available dropdown

- ✓ Test conditional logic
  - CHECK-OUT shows Due Date field
  - CHECK-IN hides Due Date field

- ✓ Test validations
  - Email fields require @army.mil format
  - Due Date must be after Checkout Date
  - All required fields enforce completion

---

## Visual Layout Preview

```
╔═══════════════════════════════════════════════════════════════╗
║  Army Equipment Check-Out/Check-In Form                       ║
╠═══════════════════════════════════════════════════════════════╣
║  Supply Shop NCO: Use this form to process equipment          ║
║  transactions for soldiers...                                 ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ Supply NCO Information                                 │  ║
║  │ Enter your information as the NCO processing this...   │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                                ║
║  Your Name (NCO Processing Form) *                             ║
║  [_________________________________]                           ║
║  Enter your full name with rank (e.g., SSG David Thompson)    ║
║                                                                ║
║  Your Email (NCO) *                                            ║
║  [_________________________________]                           ║
║  Enter your army.mil email address                             ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ Transaction Information                                │  ║
║  │ Select the type of transaction and equipment details   │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                                ║
║  Transaction Type *                                            ║
║  ○ CHECK-OUT                                                   ║
║  ○ CHECK-IN                                                    ║
║                                                                ║
║  Equipment Serial Number *                                     ║
║  [Choose ▼                                           ]         ║
║  Select the equipment item for this transaction                ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ Soldier Information                                    │  ║
║  │ Enter information for the soldier checking out or...   │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                                ║
║  Soldier User ID *                                             ║
║  [Choose ▼                                           ]         ║
║                                                                ║
║  Soldier Name (with Rank) *                                    ║
║  [_________________________________]                           ║
║                                                                ║
║  Soldier Email *                                               ║
║  [_________________________________]                           ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ Transaction Details                                    │  ║
║  │ Provide dates and condition information                │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                                ║
║  Checkout/Check-In Date *                                      ║
║  [  📅  Select date                            ]               ║
║                                                                ║
║  Due Date (CHECK-OUT only)                                     ║
║  [  📅  Select date                            ]               ║
║  (Shows only if CHECK-OUT selected above)                      ║
║                                                                ║
║  Equipment Condition *                                         ║
║  ○ Excellent - Like new, no visible wear                       ║
║  ○ Good - Minor wear, fully functional                         ║
║  ○ Fair - Some wear, still serviceable                         ║
║  ○ Poor - Significant wear, needs attention soon               ║
║  ○ Damaged - Requires repair                                   ║
║                                                                ║
║  Additional Notes/Comments                                     ║
║  [_________________________________________________]           ║
║  [                                                 ]           ║
║  [                                                 ]           ║
║                                                                ║
║                                                                ║
║                          [ Submit ]                            ║
║                                                                ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## QR Code for Mobile Access (Optional)

After getting form URL, generate QR code:

1. Visit: https://www.qr-code-generator.com/
2. Paste your Google Form URL
3. Download QR code image
4. Print and post in supply room
5. NCOs can scan with phone to access form quickly

---

## Final Checklist Before Deployment

- ✓ All 11 questions configured correctly
- ✓ Required fields marked with asterisk (*)
- ✓ Email validation on email fields
- ✓ Conditional logic set for Due Date field
- ✓ Form linked to correct Google Sheet
- ✓ Apps Script trigger installed
- ✓ Test transactions processed successfully
- ✓ Confirmation message displays correctly
- ✓ NCO training completed on form use
- ✓ Form URL bookmarked/distributed
- ✓ Backup procedures in place

---

**Form is now ready for operational use!**
