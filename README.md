# Army Equipment Inventory Management System

Automated inventory tracking system for military equipment checkout and check-in operations.

## Quick Start

### For Linux/Mac users:
```bash
./run_update.sh
```

### For Windows users:
Double-click `run_update_windows.bat` or run:
```cmd
run_update_windows.bat
```

### Manual execution:
```bash
python3 update_inventory.py
```

## Features

- ✅ **Automated Processing**: Processes form responses and updates all sheets automatically
- 📊 **Live Dashboard**: Auto-calculating metrics and KPIs using Excel formulas
- 🔄 **Transaction Tracking**: Complete checkout/check-in history
- 📦 **Inventory Management**: Real-time equipment status and availability
- 💾 **Automatic Backups**: Creates timestamped backups before each update
- 🔍 **Overdue Detection**: Automatically flags overdue checkouts

## System Components

- **Inventory Managment System.xlsx** - Main data file
- **update_inventory.py** - Processes form responses
- **setup_dashboard_formulas.py** - Sets up auto-calculating dashboard
- **run_update.sh** - Linux/Mac quick-start script
- **run_update_windows.bat** - Windows quick-start script
- **INVENTORY_SYSTEM_GUIDE.md** - Complete documentation

## Requirements

- Python 3.6 or higher
- Python packages: openpyxl, pandas, numpy

Install dependencies:
```bash
pip install openpyxl pandas numpy
```

## How It Works

1. **Form Submission**: Google Forms/Microsoft Forms populates "Form Responses" sheet
2. **Processing**: Run update script to process transactions
3. **Auto-Update**: Dashboard and all sheets update automatically
4. **Review**: Open Excel file to see current status and metrics

## Documentation

See [INVENTORY_SYSTEM_GUIDE.md](INVENTORY_SYSTEM_GUIDE.md) for complete documentation including:
- Detailed workflow
- Equipment serial number format
- Troubleshooting guide
- Customization options
- Security notes

## Support

For issues or questions, refer to the troubleshooting section in INVENTORY_SYSTEM_GUIDE.md