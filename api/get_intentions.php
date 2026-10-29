<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    // Fetch intentions along with aligned node counts
    $sql = "
        SELECT 
            i.id,
            i.title,
            i.category,
            i.status,
            COUNT(c.id) AS totalNodes,
            SUM(CASE WHEN c.is_aligned = 1 THEN 1 ELSE 0 END) AS alignedNodes
        FROM intentions i
        LEFT JOIN chakra_nodes c ON i.id = c.intention_id
        GROUP BY i.id
        ORDER BY i.created_at DESC
    ";

    $stmt = $pdo->query($sql);
    $intentions = $stmt->fetchAll();

    // Calculate progress percentage for each project
    foreach ($intentions as &$intent) {
        $total = (int)($intent['totalNodes'] ?: 7);
        $aligned = (int)($intent['alignedNodes'] ?: 0);
        $intent['progressPercentage'] = round(($aligned / $total) * 100);
    }

    echo json_encode(['status' => 'success', 'data' => $intentions]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}