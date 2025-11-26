<?php
require 'conn.php';
session_start();

// Check if logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$message = "";
$highlightId = 0;

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $projName = trim($_POST['projectName']);
    $projDes = trim($_POST['description']);
    $members = isset($_POST['members']) ? $_POST['members'] : [];

    // Check for Duplicate Name
    $checkStmt = $pdo->prepare("SELECT projectId FROM projects WHERE name = ?");
    $checkStmt->execute([$projName]);
    
    if ($checkStmt->fetch()) {
        $message = "Error: A project with the name '$projName' already exists.";
    } 

    // Check for At Least 3 Members
    elseif (count($members) < 3) {
        $message = "Error: You must select at least 3 members.";
    } else {
        // Process the Insert
        try {
            $pdo->beginTransaction();

            // Insert Project
            $sql = "INSERT INTO projects (name, description) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$projName, $projDes]);
            
            // Get the new ID
            $highlightId = $pdo->lastInsertId();

            // Insert Members into Junction Table
            $memSql = "INSERT INTO projectMembership (projectId, memberId) VALUES (?, ?)";
            $memStmt = $pdo->prepare($memSql);

            foreach ($members as $memId) {
                $memStmt->execute([$highlightId, $memId]);
            }

            // Commit the transaction
            $pdo->commit();
            $message = "Project added successfully!";
        } catch (PDOException $e) {
            $pdo->rollBack();
            $message = "Database Error: " . $e->getMessage();
        }
    }
}

// Display Data

// Get all users
$userStmt = $pdo->query("SELECT userId, firstName, lastName FROM users ORDER BY lastName");
$allUsers = $userStmt->fetchAll();

// Get all projects
$projSql = "
    SELECT p.projectId, p.name, p.description, 
           GROUP_CONCAT(CONCAT(u.firstName, ' ', u.lastName) SEPARATOR ', ') as member_names
    FROM projects p
    LEFT JOIN projectMembership pm ON p.projectId = pm.projectId
    LEFT JOIN users u ON pm.memberId = u.userId
    GROUP BY p.projectId
    ORDER BY p.projectId DESC
";
$projStmt = $pdo->query($projSql);
$allProjects = $projStmt->fetchAll();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Projects Page</title>
    <style>
        body { font-family: monospace; margin: 40px; font-size: 15px;}
        .error { color: red; font-weight: bold; }
        .success { color: green; font-weight: bold; }
        
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        
        .highlight-row { background-color: #ffffbaff; }
    </style>
</head>
<body>

    <a href="index.php">< Back to Dashboard</a>
    <h1>Add Project Information</h1>

    <?php if ($message): ?>
        <p class="<?php echo strpos($message, 'Error') !== false ? 'error' : 'success'; ?>">
            <?php echo $message; ?>
        </p>
    <?php endif; ?>

    <div>
        <form method="post">
            <label><strong>Project Name:</strong></label><br>
            <input type="text" name="projectName" required style="width: 300px;"><br><br>

            <label><strong>Description:</strong></label><br>
            <textarea name="description" rows="3" cols="50" required></textarea><br><br>

            <label><strong>Select Members (Minimum 3):</strong></label><br>
            <div style="max-height: 150px; overflow-y: scroll; border: 1px solid #ccc; padding: 5px;">
                <?php foreach ($allUsers as $u): ?>
                    <label>
                        <input type="checkbox" name="members[]" value="<?php echo $u['userId']; ?>">
                        <?php echo htmlspecialchars($u['firstName'] . " " . $u['lastName']); ?>
                    </label><br>
                <?php endforeach; ?>
            </div>
            
            <br>
            <input type="submit" value="Add Project">
        </form>
    </div>

    <h2>All Projects</h2>
    <table>
        <thead>
            <tr>
                <th>Project Name</th>
                <th>Description</th>
                <th>Members</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($allProjects as $p): ?>
                <tr class="<?php echo ($p['projectId'] == $highlightId) ? 'highlight-row' : ''; ?>">
                    <td><?php echo htmlspecialchars($p['name']); ?></td>
                    <td><?php echo htmlspecialchars($p['description']); ?></td>
                    <td><?php echo htmlspecialchars($p['member_names']); ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

</body>
</html>