#!/bin/bash
# Quick-start script to update inventory with automatic backup

set -e

EXCEL_FILE="Inventory Managment System.xlsx"
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=========================================="
echo "Army Inventory Management System Updater"
echo "=========================================="
echo

# Check if Excel file exists
if [ ! -f "$EXCEL_FILE" ]; then
    echo "ERROR: $EXCEL_FILE not found!"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "📦 Creating backup..."
cp "$EXCEL_FILE" "$BACKUP_DIR/Inventory_Backup_$TIMESTAMP.xlsx"
echo "✓ Backup saved to: $BACKUP_DIR/Inventory_Backup_$TIMESTAMP.xlsx"
echo

# Check Python dependencies
echo "🔍 Checking dependencies..."
if ! python3 -c "import openpyxl, pandas" 2>/dev/null; then
    echo "⚠️  Installing required packages..."
    pip install -q openpyxl pandas numpy
    echo "✓ Dependencies installed"
fi
echo

# Run the update script
echo "🔄 Processing form responses..."
python3 update_inventory.py
echo

# Show summary
echo "=========================================="
echo "✓ Update complete!"
echo "=========================================="
echo
echo "Next steps:"
echo "1. Open '$EXCEL_FILE' to view updates"
echo "2. Check Dashboard for current metrics"
echo "3. Verify Gear Inventory and Checkout Log"
echo
echo "Backup location: $BACKUP_DIR/Inventory_Backup_$TIMESTAMP.xlsx"
echo

# Optional: Keep only last 10 backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR" | wc -l)
if [ "$BACKUP_COUNT" -gt 10 ]; then
    echo "🗑️  Cleaning old backups (keeping last 10)..."
    cd "$BACKUP_DIR"
    ls -t | tail -n +11 | xargs rm -f
    cd ..
    echo "✓ Old backups cleaned"
fi
