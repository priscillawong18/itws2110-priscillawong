<?php
require 'conn.php';
session_start();

$errorMessage = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check if the user exists in the database
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$inputUser]);
    $user = $stmt->fetch();

    if (!$user) {
        // Go to register.php if user does not exist
        header("Location: register.php");
        exit();
    } else {
        // password_verify checks the plain password against the hash in the DB
        if (password_verify($inputPass, $user['passwordHash'])) {
            // If user exists and password is correct, go to index.php
            $_SESSION['user_id'] = $user['userId'];
            $_SESSION['nickName'] = $user['nickName'];
            header("Location: index.php");
            exit();
        } else {
            // Wrong password error
            $errorMessage = "Incorrect password. Please try again.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <style>
        body { font-family: monospace; margin: 100px; font-size: 20px;}
        .error { color: red; font-weight: bold; }
        .form-group { margin-bottom: 25px; }
    </style>
</head>
<body>

    <h2>Login</h2>

    <?php if (!empty($errorMessage)): ?>
        <p class="error"><?php echo $errorMessage; ?></p>
    <?php endif; ?>

    <form action="login.php" method="POST">
        <div class="form-group">
            <label for="username">Username:</label><br>
            <input type="text" name="username" id="username" required>
        </div>

        <div class="form-group">
            <label for="password">Password:</label><br>
            <input type="password" name="password" id="password" required>
        </div>

        <button type="submit">Log In</button>
    </form>

</body>
</html>