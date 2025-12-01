#!/usr/bin/env python3
"""
Inventory Management System - Excel Sheet Updater
This script processes Form Responses and updates Dashboard, Gear Inventory, and Checkout Log
"""

import openpyxl
import pandas as pd
from datetime import datetime
import numpy as np


def parse_serial_number(equipment_string):
    """Extract serial number from equipment string like 'SN-ACU-002 - Army Combat Uniform (OCP) Large-Long'"""
    if pd.isna(equipment_string):
        return None
    return equipment_string.split(' - ')[0].strip() if ' - ' in equipment_string else equipment_string.strip()


def parse_item_name(equipment_string):
    """Extract item name from equipment string"""
    if pd.isna(equipment_string):
        return None
    return equipment_string.split(' - ')[1].strip() if ' - ' in equipment_string else equipment_string.strip()


def generate_transaction_id(checkout_log_df):
    """Generate next transaction ID"""
    if checkout_log_df.empty:
        return "TXN-001"

    # Get all transaction IDs and find the max number
    max_id = 0
    for txn_id in checkout_log_df['Transaction ID']:
        if pd.notna(txn_id) and str(txn_id).startswith('TXN-'):
            try:
                num = int(str(txn_id).split('-')[1])
                max_id = max(max_id, num)
            except:
                pass

    return f"TXN-{max_id + 1:03d}"


def process_checkout(form_row, gear_df, checkout_df, processed_serials):
    """Process a CHECK-OUT transaction"""
    serial_num = parse_serial_number(form_row['Equipment Serial Number'])

    if not serial_num or serial_num in processed_serials:
        return gear_df, checkout_df

    processed_serials.add(serial_num)
    item_name = parse_item_name(form_row['Equipment Serial Number'])

    # Update gear inventory
    gear_mask = gear_df['Serial Number'] == serial_num
    if gear_mask.any():
        gear_df.loc[gear_mask, 'Status'] = 'Checked Out'
        gear_df.loc[gear_mask, 'Current User'] = form_row['Soldier User ID']
        gear_df.loc[gear_mask, 'Due Date'] = form_row['Due Date (CHECK-OUT only)']

    # Add to checkout log
    new_transaction = {
        'Transaction ID': generate_transaction_id(checkout_df),
        'Serial Number': serial_num,
        'Item Name': item_name if item_name else gear_df.loc[gear_mask, 'Item Name'].values[0] if gear_mask.any() else '',
        'User Name': form_row['Soldier Name'],
        'Check-Out Date': form_row['Checkout/Check-In Date'],
        'Due Date': form_row['Due Date (CHECK-OUT only)'],
        'Check-In Date': pd.NaT,
        'Status': 'Active'
    }

    # Check if overdue
    if pd.notna(new_transaction['Due Date']):
        if pd.Timestamp(new_transaction['Due Date']) < pd.Timestamp.now():
            new_transaction['Status'] = 'Overdue'

    checkout_df = pd.concat([checkout_df, pd.DataFrame([new_transaction])], ignore_index=True)

    return gear_df, checkout_df


def process_checkin(form_row, gear_df, checkout_df, processed_serials):
    """Process a CHECK-IN transaction"""
    serial_num = parse_serial_number(form_row['Equipment Serial Number'])

    if not serial_num or serial_num in processed_serials:
        return gear_df, checkout_df

    processed_serials.add(serial_num)

    # Update gear inventory
    gear_mask = gear_df['Serial Number'] == serial_num
    if gear_mask.any():
        # Determine new status based on equipment condition
        condition = form_row['Equipment Condition']
        if pd.isna(condition) or 'Excellent' in str(condition) or 'Good' in str(condition):
            new_status = 'Available'
        elif 'Damaged' in str(condition) or 'Needs' in str(condition):
            new_status = 'In Maintenance'
        else:
            new_status = 'Available'

        gear_df.loc[gear_mask, 'Status'] = new_status
        gear_df.loc[gear_mask, 'Current User'] = None
        gear_df.loc[gear_mask, 'Due Date'] = pd.NaT

    # Update checkout log - find the most recent active transaction for this serial number
    checkout_mask = (checkout_df['Serial Number'] == serial_num) & \
                    (checkout_df['Status'].isin(['Active', 'Overdue'])) & \
                    (pd.isna(checkout_df['Check-In Date']))

    if checkout_mask.any():
        checkout_df.loc[checkout_mask, 'Check-In Date'] = form_row['Checkout/Check-In Date']
        checkout_df.loc[checkout_mask, 'Status'] = 'Completed'

    return gear_df, checkout_df


def update_dashboard(gear_df, checkout_df, dashboard_df):
    """Update dashboard metrics based on current data"""
    now = datetime.now().strftime('%Y-%m-%d')

    # Calculate metrics
    total_gear = len(gear_df)
    available_items = len(gear_df[gear_df['Status'] == 'Available'])
    checked_out = len(gear_df[gear_df['Status'] == 'Checked Out'])

    # Count overdue items
    overdue_items = 0
    for idx, row in gear_df.iterrows():
        if row['Status'] == 'Checked Out' and pd.notna(row['Due Date']):
            if pd.Timestamp(row['Due Date']) < pd.Timestamp.now():
                overdue_items += 1

    in_maintenance = len(gear_df[gear_df['Status'] == 'In Maintenance'])
    lost_items = len(gear_df[gear_df['Status'] == 'Lost'])

    # Count unique users
    total_users = gear_df['Current User'].nunique() - (1 if pd.isna(gear_df['Current User']).any() else 0)
    total_users = max(total_users, len(checkout_df['User Name'].unique()))

    active_checkouts = len(checkout_df[checkout_df['Status'].isin(['Active', 'Overdue'])])
    total_transactions = len(checkout_df)
    completed_transactions = len(checkout_df[checkout_df['Status'] == 'Completed'])

    # Calculate rates
    utilization_rate = checked_out / total_gear if total_gear > 0 else 0
    overdue_rate = overdue_items / checked_out if checked_out > 0 else 0

    # Update dashboard dataframe
    metrics_map = {
        'Total Gear Items': total_gear,
        'Available Items': available_items,
        'Checked Out Items': checked_out,
        'Overdue Items': overdue_items,
        'Items in Maintenance': in_maintenance,
        'Lost Items': lost_items,
        'Total Users': total_users,
        'Active Checkouts': active_checkouts,
        'Total Transactions': total_transactions,
        'Completed Transactions': completed_transactions,
        'Utilization Rate': utilization_rate,
        'Overdue Rate': overdue_rate
    }

    for metric, value in metrics_map.items():
        mask = dashboard_df['Metric'] == metric
        if mask.any():
            dashboard_df.loc[mask, 'Value'] = value
            dashboard_df.loc[mask, 'Last Updated'] = now

    return dashboard_df


def main():
    """Main function to process form responses and update all sheets"""
    excel_file = '/home/user/InventoryManagement/Inventory Managment System.xlsx'

    print("Loading Excel file...")
    # Read all sheets
    form_responses_df = pd.read_excel(excel_file, sheet_name='Form Responses')
    gear_df = pd.read_excel(excel_file, sheet_name='gear_inventory')
    checkout_df = pd.read_excel(excel_file, sheet_name='checkout_log')
    dashboard_df = pd.read_excel(excel_file, sheet_name='dashboard')

    print(f"Found {len(form_responses_df)} form response(s) to process")

    # Keep track of processed serial numbers to avoid duplicates in single run
    processed_serials = set()

    # Process each form response
    for idx, row in form_responses_df.iterrows():
        transaction_type = row['Transaction Type']
        serial_num = parse_serial_number(row['Equipment Serial Number'])

        print(f"\nProcessing {transaction_type} for {serial_num}...")

        if transaction_type == 'CHECK-OUT':
            gear_df, checkout_df = process_checkout(row, gear_df, checkout_df, processed_serials)
        elif transaction_type == 'CHECK-IN':
            gear_df, checkout_df = process_checkin(row, gear_df, checkout_df, processed_serials)

    # Update dashboard with new metrics
    print("\nUpdating dashboard metrics...")
    dashboard_df = update_dashboard(gear_df, checkout_df, dashboard_df)

    # Save back to Excel
    print("\nSaving changes to Excel file...")
    with pd.ExcelWriter(excel_file, engine='openpyxl', mode='a', if_sheet_exists='overlay') as writer:
        # Write updated sheets
        gear_df.to_excel(writer, sheet_name='gear_inventory', index=False)
        checkout_df.to_excel(writer, sheet_name='checkout_log', index=False)
        dashboard_df.to_excel(writer, sheet_name='dashboard', index=False)

    print("\n✓ Successfully updated all sheets!")
    print(f"  - Gear Inventory: {len(gear_df)} items")
    print(f"  - Checkout Log: {len(checkout_df)} transactions")
    print(f"  - Dashboard: {len(dashboard_df)} metrics")


if __name__ == "__main__":
    main()
