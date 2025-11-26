<?php
require 'conn.php';
session_start();

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first = $_POST['firstName'];
    $last  = $_POST['lastName'];
    $nick  = $_POST['nickName'];
    $user  = $_POST['username'];
    $pass  = $_POST['password'];

    // Check if username exists
    $check = $pdo->prepare("SELECT userId FROM users WHERE username = ?");
    $check->execute([$user]);
    
    if ($check->fetch()) {
        $message = "Error: That username is already taken.";
    } else {
        // Hash the password
        $hashedPassword = password_hash($pass, PASSWORD_DEFAULT);

        // Insert with new column names
        $sql = "INSERT INTO users (firstName, lastName, nickName, username, password_hash) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        try {
            $stmt->execute([$first, $last, $nick, $user, $hashedPassword]);
            
            $_SESSION['user_id'] = $pdo->lastInsertId();
            $_SESSION['nickName'] = $nick;
            header("Location: index.php");
            exit();
        } catch (PDOException $e) {
            $message = "Error: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <style>
        body { font-family: monospace; margin: 100px; font-size: 20px;}
        /* .error { color: red; font-weight: bold; } */
        /* .form-group { margin-bottom: 25px; } */
    </style>
</head>
<body>
    <h2>Register</h2>
    <p style="color:red"><?php echo $message; ?></p>

    <form method="post">
        <label for="firstName">First Name:</label><br>
        <input type="text" id="firstName" name="firstName" required><br><br>

        <label for="lastName">Last Name:</label><br>
        <input type="text" id="lastName" name="lastName" required><br><br>

        <label for="nickName">Nickname:</label><br>
        <input type="text" id="nickName" name="nickName" required><br><br>

        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <input type="submit" value="Register">
    </form>
</body>
</html>