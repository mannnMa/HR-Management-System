<?php
$employeeId = preg_replace('/[^A-Za-z0-9]/', '', $_GET['employeeId'] ?? '');
$payslipsDir = __DIR__ . '/../../payslips/';
$payslips = [];

if ($employeeId && is_dir($payslipsDir)) {
    foreach (glob($payslipsDir . "payslip_{$employeeId}_*.pdf") as $file) {
        $base = pathinfo($file, PATHINFO_FILENAME);
        $metaFile = $payslipsDir . $base . ".json";
        $meta = [
            "period" => "",
            "payDate" => "",
            "netPay" => ""
        ];
        if (file_exists($metaFile)) {
            $json = file_get_contents($metaFile);
            $meta = json_decode($json, true) ?: $meta;
        }
        $payslips[] = [
            'filename' => basename($file),
            'url' => "../../payslips/" . basename($file),
            'date' => date("Y-m-d", filemtime($file)),
            'period' => $meta['period'],
            'payDate' => $meta['payDate'],
            'netPay' => $meta['netPay']
        ];
    }
}
header('Content-Type: application/json');
echo json_encode($payslips);
?>
