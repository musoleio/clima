import 'firebase/firestore';
import * as XLSX from 'xlsx';

const csvExport = [
  [
    'Employee Number',
    'End Date',
    'Start Date',
    'Monthly Installments',
    'Total Amount',
    'Deduction Code',
    'Approved',
    'Received',
    'NRC Number',
    'First Name',
    'Surname',
    'Tel',
    'Area',
    'Institution',
    'Comment',
    'Agent',
    'Order Type',
    'Product',
    'Quantity',
    'Cash Price',
  ],
];


// Function to export Firestore collection data to Excel
function exportDataToExcel(data, collectionName, fileName, type) {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  let normalizedData1;
  // Normalize the data and map it to the desired structure
  if (type == 'orders') {
     normalizedData1 = data.map((item) => [
      item.employeeNumber,
      item.monthOfLastDeduct,
      item.monthOfFirstDeduct,
      item.installmentAmount,
      item.totalPrice,
      '',
      item.orderStatus,
      item.isCollected.toString(),
      item.nrc,
      item.firstName,
      item.lastName,
      item.customer.primaryPhoneNumber,
      item.customer.district,
      item.customer.institution,
      item.comment,
      item.agent.firstName + ' ' + item.agent.lastName,
      item.formType ?? '-',
    ]);
  }

  // Create a worksheet from the normalized data
  let worksheet
  if (type == 'orders') {
   worksheet =  XLSX.utils.aoa_to_sheet([csvExport[0], ...normalizedData1]);
  } else if (type == 'customers') {
    // Remove the signature field from each data object
    const dataWithoutSignature = data.map(({ signature, ...rest }) => rest);

    // Convert the data to a worksheet
     worksheet = XLSX.utils.json_to_sheet(dataWithoutSignature);
  } else {
    worksheet = XLSX.utils.json_to_sheet(data)
  }

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, collectionName);

  // Export the workbook to an Excel file
  XLSX.writeFile(workbook, fileName);
}

export default exportDataToExcel;
