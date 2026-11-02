<?php
declare(strict_types=1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$intentionId = isset($_GET['intention_id']) ? (int)$_GET['intention_id'] : 0;
$chakraStage = isset($_GET['chakra_stage']) ? trim((string)$_GET['chakra_stage']) : 'solar_plexus';

if ($intentionId <= 0) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Valid intention_id is required.'
    ]);
    exit;
}

try {
    $statement = $pdo->prepare(
        "SELECT id, intention_id AS intentionId, chakra_stage AS chakraStage, title, 
                CAST(is_completed AS UNSIGNED) AS isCompleted, created_at AS createdAt 
         FROM action_steps 
         WHERE intention_id = :intentionId AND chakra_stage = :chakraStage 
         ORDER BY id ASC"
    );
    $statement->execute([
        ':intentionId' => $intentionId,
        ':chakraStage' => $chakraStage
    ]);

    $actions = $statement->fetchAll(PDO::FETCH_ASSOC);

    // Format boolean values cleanly
    foreach ($actions as &$action) {
        $action['isCompleted'] = (bool)$action['isCompleted'];
    }

    echo json_encode([
        'status' => 'success',
        'data' => $actions
    ]);
} catch (PDOException $pdoException) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $pdoException->getMessage()
    ]);
}