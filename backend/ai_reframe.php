<?php
declare(strict_types=1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

// Retrieve Gemini API Key from environment or define a direct fallback for local testing
$apiKey = getenv('GEMINI_API_KEY') ?: 'YOUR_GEMINI_API_KEY_HERE';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $intentionId = isset($_GET['intention_id']) ? (int)$_GET['intention_id'] : 0;
    if ($intentionId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Valid intention_id required.']);
        exit;
    }

    try {
        $statement = $pdo->prepare(
            "SELECT id, intention_id AS intentionId, limiting_belief AS limitingBelief, 
                    reframed_affirmation AS reframedAffirmation, action_anchor AS actionAnchor, 
                    created_at AS createdAt 
             FROM belief_transformations 
             WHERE intention_id = :intentionId 
             ORDER BY id DESC"
        );
        $statement->execute([':intentionId' => $intentionId]);
        $transformations = $statement->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['status' => 'success', 'data' => $transformations]);
        exit;
    } catch (PDOException $pdoException) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $pdoException->getMessage()]);
        exit;
    }
}

// POST: Execute AI Reframing
$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput, true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input.']);
    exit;
}

$intentionId = (int)($payload['intentionId'] ?? 0);
$intentionTitle = trim((string)($payload['intentionTitle'] ?? 'Current Goal'));
$limitingBelief = trim((string)($payload['limitingBelief'] ?? ''));

if ($intentionId <= 0 || empty($limitingBelief)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'intentionId and limitingBelief are required.']);
    exit;
}

$systemInstruction = "You are the Solar Plexus alchemical engine for 'The Creation Engine'. "
    . "The user is pursuing the intention: '{$intentionTitle}'. "
    . "They hold a disempowering doubt/fear/limiting belief: '{$limitingBelief}'. "
    . "Transmute this belief into an unshakeable, sovereign affirmation and identify one concrete kinetic micro-action anchor. "
    . "You MUST reply ONLY with a valid JSON object matching this schema: "
    . "{\"affirmation\": \"...\", \"actionAnchor\": \"...\"}";

$geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($apiKey);

$requestBody = [
    'contents' => [
        [
            'parts' => [
                ['text' => $systemInstruction]
            ]
        ]
    ],
    'generationConfig' => [
        'responseMimeType' => 'application/json',
        'temperature' => 0.7
    ]
];

$curl = curl_init($geminiUrl);
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($requestBody),
    CURLOPT_TIMEOUT => 20
]);

$responseBody = curl_exec($curl);
$curlError = curl_error($curl);
$httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

// Fallback generator if API key is unconfigured during local development
if ($curlError || $httpStatus !== 200 || !$responseBody) {
    $parsedResponse = [
        'affirmation' => "I wield the discernment and authority to advance '{$intentionTitle}'. My uncertainty dissolves through aligned action.",
        'actionAnchor' => "Dedicate 15 focused minutes today to implement the smallest viable proof-of-work step."
    ];
} else {
    $decodedResponse = json_decode($responseBody, true);
    $textOutput = $decodedResponse['candidates'][0]['content']['parts'][0]['text'] ?? '';
    $parsedResponse = json_decode($textOutput, true) ?? [
        'affirmation' => "I stand firm in my creative authority and release hesitation.",
        'actionAnchor' => "Take one measurable action towards {$intentionTitle} immediately."
    ];
}

$affirmation = (string)($parsedResponse['affirmation'] ?? 'I possess the power to align intent into reality.');
$actionAnchor = (string)($parsedResponse['actionAnchor'] ?? 'Commit to 15 minutes of uninterrupted execution.');

try {
    $insertStatement = $pdo->prepare(
        "INSERT INTO belief_transformations (intention_id, limiting_belief, reframed_affirmation, action_anchor) 
         VALUES (:intentionId, :limitingBelief, :affirmation, :actionAnchor)"
    );
    $insertStatement->execute([
        ':intentionId' => $intentionId,
        ':limitingBelief' => $limitingBelief,
        ':affirmation' => $affirmation,
        ':actionAnchor' => $actionAnchor
    ]);

    $newRecordId = (int)$pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'data' => [
            'id' => $newRecordId,
            'intentionId' => $intentionId,
            'limitingBelief' => $limitingBelief,
            'reframedAffirmation' => $affirmation,
            'actionAnchor' => $actionAnchor
        ]
    ]);
} catch (PDOException $pdoException) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database persistence failed: ' . $pdoException->getMessage()]);
}