<?php
session_start();

// Check if logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Index</title>
    <style> 
        body { font-family: monospace; margin: 100px; font-size: 20px;} 
    </style>
</head>
<body>
    <h1>Welcome, <?php echo htmlspecialchars($_SESSION['nickName']); ?>!</h1>
    
    <p>Select an option:</p>
    
    <ul>
        <li><a href="project.php">Add a New Project</a></li>
        <li><a href="project.php">View All Projects</a></li>
    </ul>

    <br>
    <a href="login.php">Log Out</a>
</body>
</html>