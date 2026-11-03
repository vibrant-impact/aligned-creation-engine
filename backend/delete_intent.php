<?php
// Display errors in the response during development to identify the root cause
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Match your existing database include
// Check if your project uses db.php, connection.php, or config/database.php
$dbIncluded = false;
$possiblePaths = [
    __DIR__ . '/../db.php',
    __DIR__ . '/../config/database.php',
    __DIR__ . '/../db_connect.php',
    __DIR__ . '/db.php'
];

foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $dbIncluded = true;
        break;
    }
}

if (!$dbIncluded) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database configuration file could not be located.'
    ]);
    exit;
}

// 2. Resolve database connection handle ($pdo, $db, or $conn)
$databaseConnection = null;
if (isset($pdo) && $pdo instanceof PDO) {
    $databaseConnection = $pdo;
} elseif (isset($db) && $db instanceof PDO) {
    $databaseConnection = $db;
} elseif (isset($conn) && $conn instanceof PDO) {
    $databaseConnection = $conn;
}

if (!$databaseConnection) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'No active PDO database connection found ($pdo, $db, or $conn).'
    ]);
    exit;
}

try {
    // 3. Extract the ID payload
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    $intentionId = null;
    if (isset($payload['id']) && !empty($payload['id'])) {
        $intentionId = (int)$payload['id'];
    } elseif (isset($_GET['id']) && !empty($_GET['id'])) {
        $intentionId = (int)$_GET['id'];
    }

    if (!$intentionId) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing intention ID in request payload.'
        ]);
        exit;
    }

    // 4. Execute cascading cleanup in a transaction
    $databaseConnection->beginTransaction();

    // Remove child records first to satisfy foreign key rules
    $stmtActions = $databaseConnection->prepare('DELETE FROM action_steps WHERE intention_id = :id');
    $stmtActions->execute([':id' => $intentionId]);

    $stmtBeliefs = $databaseConnection->prepare('DELETE FROM belief_transformations WHERE intention_id = :id');
    $stmtBeliefs->execute([':id' => $intentionId]);

    // Remove parent row from intentions
    $stmtIntention = $databaseConnection->prepare('DELETE FROM intentions WHERE id = :id');
    $stmtIntention->execute([':id' => $intentionId]);

    $databaseConnection->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Intention dissolved successfully.',
        'deletedId' => $intentionId
    ]);

} catch (Throwable $e) {
    if (isset($databaseConnection) && $databaseConnection->inTransaction()) {
        $databaseConnection->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database failure: ' . $e->getMessage()
    ]);
}