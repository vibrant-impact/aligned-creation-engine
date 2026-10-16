document.addEventListener("DOMContentLoaded", () => {
  const initialIntentions = [
    {
      id: "intent_1",
      title: "Launch Creative Studio",
      category: "Career & Business",
      alignedNodes: 5,
      totalNodes: 7,
      progressPercentage: 71,
      accentColor: "var(--chakra-root)"
    },
    {
      id: "intent_2",
      title: "Publish My Novel",
      category: "Creative Expression",
      alignedNodes: 3,
      totalNodes: 7,
      progressPercentage: 43,
      accentColor: "var(--chakra-throat)"
    },
    {
      id: "intent_3",
      title: "Vibrant Health & Energy",
      category: "Vitality & Body",
      alignedNodes: 6,
      totalNodes: 7,
      progressPercentage: 86,
      accentColor: "var(--chakra-heart)"
    }
  ];

  const intentContainer = document.getElementById("intentContainer");

  function renderIntentions(intentions) {
    if (!intentContainer) return;
    intentContainer.innerHTML = "";

    intentions.forEach((intent) => {
      const card = document.createElement("article");
      card.className = "intent-card";
      card.innerHTML = `
        <div class="card-top">
          <h3>${intent.title}</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${intent.category}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          Status: <strong>${intent.alignedNodes}/${intent.totalNodes} Aligned</strong> (${intent.progressPercentage}%)
        </p>
        <div class="progress-track">
          <div class="progress-bar" style="width: ${intent.progressPercentage}%;"></div>
        </div>
        <button class="btn-primary" style="margin-top: 8px; font-size: 0.8rem; padding: 6px 14px;">Open Workshop</button>
      `;
      intentContainer.appendChild(card);
    });
  }

  renderIntentions(initialIntentions);
});

// Test full-stack communication with the PHP backend
async function checkBackendConnection() {
  try {
    const response = await fetch("api/test.php", {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("%c✓ Backend Connection Successful:", "color: #00e676; font-weight: bold;", data);

    // Optionally update the UI to show connection status
    showConnectionBadge(data);
  } catch (error) {
    console.warn("%c✕ Backend Connection Failed:", "color: #ff1744; font-weight: bold;", error.message);
  }
}

// Visual status indicator in the app header
function showConnectionBadge(serverData) {
  const brandContainer = document.querySelector(".brand");
  if (!brandContainer) return;

  const badge = document.createElement("span");
  badge.style.cssText = `
    font-size: 0.7rem;
    padding: 3px 8px;
    border-radius: 12px;
    background: rgba(0, 230, 118, 0.15);
    border: 1px solid var(--chakra-heart, #00e676);
    color: var(--chakra-heart, #00e676);
    margin-left: 8px;
    letter-spacing: 0.5px;
  `;
  badge.textContent = `API Online (PHP ${serverData.environment.phpVersion})`;
  brandContainer.appendChild(badge);
}

// Call on startup
document.addEventListener("DOMContentLoaded", () => {
  checkBackendConnection();
});