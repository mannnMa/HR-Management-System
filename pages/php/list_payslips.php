<?php
$employeeId = $_GET['employeeId'] ?? '';
$payslipDir = __DIR__ . '/../payslips/';
$payslips = [];

if ($employeeId && is_dir($payslipDir)) {
    foreach (scandir($payslipDir) as $file) {
        if (strpos($file, $employeeId) !== false && pathinfo($file, PATHINFO_EXTENSION) === 'pdf') {
            // Optionally, read JSON meta for period, payDate, netPay
            $metaFile = $payslipDir . pathinfo($file, PATHINFO_FILENAME) . '.json';
            $period = $payDate = $netPay = '';
            if (file_exists($metaFile)) {
                $meta = json_decode(file_get_contents($metaFile), true);
                $period = $meta['period'] ?? '';
                $payDate = $meta['payDate'] ?? '';
                $netPay = $meta['netPay'] ?? '';
            }
            $payslips[] = [
                'filename' => $file,
                'url' => "payslips/$file", // relative to /pages/
                'period' => $period,
                'payDate' => $payDate,
                'netPay' => $netPay
            ];
        }
    }
}
header('Content-Type: application/json');
echo json_encode($payslips);
?>
