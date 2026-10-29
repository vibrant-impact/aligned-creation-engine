<?php
// api/create_intent.php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// Decode JSON input from fetch body
$inputData = json_decode(file_get_contents('php://input'), true);

$title = trim($inputData['title'] ?? '');
$category = trim($inputData['category'] ?? '');

if (empty($title) || empty($category)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Both title and category are required.'
    ]);
    exit();
}

try {
    $pdo->beginTransaction();

    // 1. Insert new intention record
    $intentQuery = "INSERT INTO intentions (title, category, status) VALUES (:title, :category, 'active')";
    $intentStatement = $pdo->prepare($intentQuery);
    $intentStatement->execute([
        ':title' => $title,
        ':category' => $category
    ]);

    $newIntentId = $pdo->lastInsertId();

    // 2. Initialize default 7 chakra nodes for this intention
    $chakraNames = ['crown', 'third_eye', 'throat', 'heart', 'solar_plexus', 'sacral', 'root'];
    $nodeQuery = "INSERT INTO chakra_nodes (intention_id, chakra_name, diagnostic_score, is_aligned) 
                  VALUES (:intentionId, :chakraName, 1, 0)";
    $nodeStatement = $pdo->prepare($nodeQuery);

    foreach ($chakraNames as $chakraName) {
        $nodeStatement->execute([
            ':intentionId' => $newIntentId,
            ':chakraName' => $chakraName
        ]);
    }

    $pdo->commit();

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Intention created and 7 chakra nodes initialized.',
        'data' => [
            'id' => (int)$newIntentId,
            'title' => $title,
            'category' => $category,
            'status' => 'active',
            'totalNodes' => 7,
            'alignedNodes' => 0,
            'progressPercentage' => 0
        ]
    ]);
} catch (PDOException $databaseException) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to save intention: ' . $databaseException->getMessage()
    ]);
}
exit();