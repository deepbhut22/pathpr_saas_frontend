import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Converts JSON data to Excel and triggers browser download.
 */
export const downloadUserDataAsExcel = (data: any[], fileName = 'User_Report.xlsx') => {
    // Convert JSON array to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook with a single sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');

    // Write the Excel file
    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });

    // Create a Blob and trigger download
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
};
