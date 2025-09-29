<?php
//  http://localhost/mi-farmacia/api/hash_admin.php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "mi_farmacia";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

//  hashear 
$plain = "1234";
$hash = password_hash($plain, PASSWORD_DEFAULT);

//  email admin@correo.com
$email = "admin@correo.com";
$stmt = $conn->prepare("UPDATE usuarios SET password = ? WHERE email = ?");
$stmt->bind_param("ss", $hash, $email);

if ($stmt->execute()) {
    echo "Contraseña actualizada a hash. Ahora puedes iniciar sesión con: $email / $plain";
} else {
    echo "Error: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
