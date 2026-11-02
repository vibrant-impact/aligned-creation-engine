<?php
declare(strict_types=1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput, true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
    exit;
}

$actionType = $payload['actionType'] ?? 'create';

try {
    if ($actionType === 'create') {
        $intentionId = (int)($payload['intentionId'] ?? 0);
        $chakraStage = trim((string)($payload['chakraStage'] ?? 'solar_plexus'));
        $title = trim((string)($payload['title'] ?? ''));

        if ($intentionId <= 0 || empty($title)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing intentionId or title']);
            exit;
        }

        $stmt = $pdo->prepare(
            "INSERT INTO action_steps (intention_id, chakra_stage, title, is_completed) 
             VALUES (:intentionId, :chakraStage, :title, 0)"
        );
        $stmt->execute([
            ':intentionId' => $intentionId,
            ':chakraStage' => $chakraStage,
            ':title' => $title
        ]);

        $newId = (int)$pdo->lastInsertId();

        echo json_encode([
            'status' => 'success',
            'data' => [
                'id' => $newId,
                'intentionId' => $intentionId,
                'chakraStage' => $chakraStage,
                'title' => $title,
                'isCompleted' => false
            ]
        ]);
        exit;
    }

    if ($actionType === 'toggle') {
        $actionId = (int)($payload['actionId'] ?? 0);
        $isCompleted = !empty($payload['isCompleted']) ? 1 : 0;

        if ($actionId <= 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid actionId']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE action_steps SET is_completed = :isCompleted WHERE id = :actionId");
        $stmt->execute([
            ':isCompleted' => $isCompleted,
            ':actionId' => $actionId
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Action updated successfully'
        ]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Unrecognized actionType']);
} catch (PDOException $pdoException) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $pdoException->getMessage()]);
}