<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "mi_farmacia";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

$nombre   = $data["nombre"] ?? '';
$email    = $data["email"] ?? '';
$password = $data["password"] ?? '';
$rol      = $data["rol"] ?? 'user';

if (!$nombre || !$email || !$password) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}


$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,?)");
$stmt->bind_param("ssss", $nombre, $email, $hash, $rol);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario registrado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar usuario: ".$conn->error]);
}

$stmt->close();
$conn->close();
?>
