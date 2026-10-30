<?php
// Set response headers for JSON and CORS (Cross-Origin Resource Sharing)
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simulate fetching server and app health status
$response = [
    'status' => 'success',
    'message' => 'The Creation Engine API is connected and responding.',
    'serverTime' => date('Y-m-d H:i:s'),
    'environment' => [
        'phpVersion' => phpversion(),
        'protocol' => $_SERVER['SERVER_PROTOCOL'] ?? 'HTTP/1.1',
        'requestMethod' => $_SERVER['REQUEST_METHOD']
    ],
    'sampleProject' => [
        'id' => 'intent_seed_01',
        'title' => 'Sample Live Intent from Server',
        'activeChakra' => 'Throat (Voice)',
        'alignmentScore' => 71
    ]
];

// Return clean JSON output with a 200 OK status
http_response_code(200);
echo json_encode($response, JSON_PRETTY_PRINT);
exit();