<?php
header("Content-Type: application/json");
if ($_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(405); echo json_encode(["error" => "POST required"]); exit; }
$firebaseApiKey = "AIzaSyDbSC4OKRxV623UyBF_Odt3kgNnUjq4uaY";
$token = $_SERVER["HTTP_AUTHORIZATION"] ?? "";
if (!preg_match("/Bearer\\s+(.+)/i", $token, $matches)) { http_response_code(401); echo json_encode(["error" => "Missing authentication token"]); exit; }
$ch = curl_init("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" . urlencode($firebaseApiKey));
curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode(["idToken" => trim($matches[1])]), CURLOPT_HTTPHEADER => ["Content-Type: application/json"], CURLOPT_RETURNTRANSFER => true]);
$authData = json_decode(curl_exec($ch), true); curl_close($ch);
if (empty($authData["users"][0]["localId"])) { http_response_code(401); echo json_encode(["error" => "Invalid Firebase login"]); exit; }
$uid = $authData["users"][0]["localId"];
if (!isset($_FILES["document"]) || $_FILES["document"]["error"] !== UPLOAD_ERR_OK) { http_response_code(400); echo json_encode(["error" => "No valid document received"]); exit; }
$file = $_FILES["document"];
if ($file["size"] > 5 * 1024 * 1024) { http_response_code(400); echo json_encode(["error" => "Maximum file size is 5 MB"]); exit; }
$types = ["application/pdf" => "pdf", "image/jpeg" => "jpg", "image/png" => "png"];
$mime = mime_content_type($file["tmp_name"]);
if (!isset($types[$mime])) { http_response_code(400); echo json_encode(["error" => "Only PDF, JPG and PNG files are allowed"]); exit; }
$name = $uid . "_" . bin2hex(random_bytes(16)) . "." . $types[$mime];
$dir = __DIR__ . "/../uploads/documents/";
if (!is_dir($dir)) { mkdir($dir, 0755, true); }
if (!move_uploaded_file($file["tmp_name"], $dir . $name)) { http_response_code(500); echo json_encode(["error" => "Could not save document"]); exit; }
echo json_encode(["success" => true, "uid" => $uid, "fileUrl" => "https://tpo.sietpanchkula.ac.in/uploads/documents/" . $name, "filename" => $name]);
