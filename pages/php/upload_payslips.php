<?php
$uploadDir = __DIR__ . '/../../payslips/';

// Create the /payslips folder if it doesn't exist
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        die("Failed to create directory: $uploadDir");
    }
}

foreach (['pdfFile', 'metaFile'] as $field) {
    if (isset($_FILES[$field])) {
        $fileName = basename($_FILES[$field]['name']);
        $targetPath = $uploadDir . $fileName;
        move_uploaded_file($_FILES[$field]['tmp_name'], $targetPath);
    }
}
echo "Upload complete";
?>
