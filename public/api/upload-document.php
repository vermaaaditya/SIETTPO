<?php
/**
 * Hostinger PHP File Manager Upload Script for SIET Panchkula TPO
 * Target Path on Hostinger: /public_html/api/upload-document.php
 * File Storage Directory:   /public_html/uploads/documents/ (50GB storage)
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Content-Type: application/json');

// Handle CORS Preflight OPTIONS Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST request.']);
    exit;
}

if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error encountered']);
    exit;
}

$file = $_FILES['document'];
$maxSizeBytes = 5 * 1024 * 1024; // 5 MB file size limit

if ($file['size'] > $maxSizeBytes) {
    http_response_code(400);
    echo json_encode(['error' => 'File exceeds maximum limit of 5MB']);
    exit;
}

$allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['error' => 'Unsupported file type. Only PDF, JPG, and PNG files are allowed']);
    exit;
}

// Storage target folder in Hostinger File Manager
$uploadDir = __DIR__ . '/../uploads/documents/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename to prevent overwrites
$uniqueName = bin2hex(random_bytes(8)) . '_' . time() . '.' . $extension;
$targetFilePath = $uploadDir . $uniqueName;

if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
    $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    $fileUrl = $scheme . "://" . $host . '/uploads/documents/' . $uniqueName;

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'File uploaded successfully to Hostinger storage',
        'fileUrl' => $fileUrl,
        'fileName' => $file['name'],
        'fileSize' => $file['size']
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: Unable to save uploaded file']);
}
?>
