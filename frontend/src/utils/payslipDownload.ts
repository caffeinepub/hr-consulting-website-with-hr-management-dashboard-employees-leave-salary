import type { Payslip } from '@/backend';
import { formatCurrency, formatDate } from './formatters';

export function downloadPayslip(payslip: Payslip, employeeName: string) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthName = monthNames[Number(payslip.month) - 1] || 'Unknown';
  const year = Number(payslip.year);
  
  // Create HTML content for the payslip
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payslip - ${monthName} ${year}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #131E3A;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #131E3A;
      margin: 0 0 10px 0;
    }
    .header p {
      margin: 5px 0;
      color: #666;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #131E3A;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e0e0e0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-label {
      font-weight: 600;
      color: #555;
    }
    .info-value {
      color: #333;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 5px;
      margin-top: 20px;
      font-size: 18px;
      font-weight: bold;
    }
    .total-label {
      color: #131E3A;
    }
    .total-value {
      color: #131E3A;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body {
        margin: 0;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>PAYSLIP</h1>
    <p><strong>${monthName} ${year}</strong></p>
    <p>Generated on ${formatDate(Number(payslip.createdAt))}</p>
  </div>

  <div class="section">
    <div class="section-title">Employee Information</div>
    <div class="info-row">
      <span class="info-label">Employee Name:</span>
      <span class="info-value">${employeeName}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Employee ID:</span>
      <span class="info-value">#${Number(payslip.employeeId)}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Leave Balance:</span>
      <span class="info-value">${Number(payslip.leaveBalance)} days</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Salary Breakdown</div>
    <div class="info-row">
      <span class="info-label">Base Salary:</span>
      <span class="info-value">${formatCurrency(Number(payslip.salaryDetails.base))}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Bonus:</span>
      <span class="info-value" style="color: #28a745;">+${formatCurrency(Number(payslip.salaryDetails.bonus))}</span>
    </div>
    <div class="info-row">
      <span class="info-label">PF Deduction:</span>
      <span class="info-value" style="color: #dc3545;">-${formatCurrency(Number(payslip.salaryDetails.pfDeduction))}</span>
    </div>
  </div>

  <div class="total-row">
    <span class="total-label">Final Payable Amount:</span>
    <span class="total-value">${formatCurrency(Number(payslip.salaryDetails.finalPayable))}</span>
  </div>

  <div class="footer">
    <p>This is a computer-generated payslip and does not require a signature.</p>
    <p>For any queries, please contact the HR department.</p>
  </div>
</body>
</html>
  `;

  // Create a Blob from the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = `Payslip_${employeeName.replace(/\s+/g, '_')}_${monthName}_${year}.html`;
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
