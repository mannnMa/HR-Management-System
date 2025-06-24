<?php
$payslipDir = __DIR__ . '/../payslips/'; // Adjust path as needed

if (!is_dir($payslipDir)) {
    mkdir($payslipDir, 0777, true);
}

if (isset($_FILES['pdfFile'])) {
    move_uploaded_file($_FILES['pdfFile']['tmp_name'], $payslipDir . basename($_FILES['pdfFile']['name']));
}
if (isset($_FILES['metaFile'])) {
    move_uploaded_file($_FILES['metaFile']['tmp_name'], $payslipDir . basename($_FILES['metaFile']['name']));
}
echo "Payslip files uploaded!";
?>
