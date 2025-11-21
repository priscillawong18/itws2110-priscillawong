<?php
$host = 'localhost';
$db   = 'ITWS2110-Fall2025-wongp4-Quiz2'; 
$user = 'root';
$pass = '';    

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass);
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit();
}
?>