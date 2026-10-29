// Clean and unified main.js for The Creation Engine

document.addEventListener("DOMContentLoaded", () => {
  // 1. Query elements safely inside DOMContentLoaded
  const modalOverlay = document.getElementById("goalModalOverlay");
  const openModalBtn = document.getElementById("addIntentBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelGoalBtn = document.getElementById("cancelGoalBtn");
  const newGoalForm = document.getElementById("newGoalForm");
  const intentContainer = document.getElementById("intentContainer");

  // 2. Modal Controls
  function openGoalModal() {
    if (!modalOverlay) {
      console.error("Modal overlay element not found!");
      return;
    }
    modalOverlay.classList.remove("hidden");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.getElementById("goalTitle")?.focus();
  }

  function closeGoalModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add("hidden");
    modalOverlay.setAttribute("aria-hidden", "true");
    newGoalForm?.reset();
  }

  // 3. Event Listeners for Modal
  if (openModalBtn) {
    openModalBtn.addEventListener("click", openGoalModal);
  } else {
    console.error("Button #addIntentBtn not found in DOM");
  }

  closeModalBtn?.addEventListener("click", closeGoalModal);
  cancelGoalBtn?.addEventListener("click", closeGoalModal);

  // Close when clicking dark backdrop
  modalOverlay?.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeGoalModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalOverlay?.classList.contains("hidden")) {
      closeGoalModal();
    }
  });

  // 4. Form Submission (POST to PHP API)
  newGoalForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titleInput = document.getElementById("goalTitle");
    const categoryInput = document.getElementById("goalCategory");
    const submitButton = document.getElementById("submitGoalBtn");

    const goalData = {
      title: titleInput.value.trim(),
      category: categoryInput.value.trim()
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Igniting...";
    }

    try {
      const response = await fetch("api/create_intent.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(goalData)
      });

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to create intent");
      }

      closeGoalModal();
      loadIntentions(); // Refresh cards from database
    } catch (submissionError) {
      console.error("Submission failed:", submissionError);
      alert(`Error: ${submissionError.message}`);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Ignite Journey";
      }
    }
  });

  // 5. Render Cards
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
          Status: <strong>${intent.alignedNodes || 0}/${intent.totalNodes || 7} Aligned</strong> (${intent.progressPercentage || 0}%)
        </p>
        <div class="progress-track">
          <div class="progress-bar" style="width: ${intent.progressPercentage || 0}%;"></div>
        </div>
        <button class="btn-primary" style="margin-top: 8px; font-size: 0.8rem; padding: 6px 14px;">Open Workshop</button>
      `;
      intentContainer.appendChild(card);
    });
  }

  // 6. Fetch Intentions from MySQL
  async function loadIntentions() {
    try {
      const response = await fetch("api/get_intentions.php");
      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        renderIntentions(result.data);
      }
    } catch (error) {
      console.warn("Could not load from DB:", error);
    }
  }

  // 7. Health Check API (Run once only)
  async function checkBackendConnection() {
    try {
      const response = await fetch("api/test.php");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      // Ensure we don't add duplicate badges
      if (!document.getElementById("apiOnlineBadge")) {
        const brandContainer = document.querySelector(".brand");
        if (brandContainer) {
          const badge = document.createElement("span");
          badge.id = "apiOnlineBadge";
          badge.style.cssText = `
            font-size: 0.7rem;
            padding: 3px 8px;
            border-radius: 12px;
            background: rgba(0, 230, 118, 0.15);
            border: 1px solid var(--chakra-heart, #00e676);
            color: var(--chakra-heart, #00e676);
            margin-left: 8px;
          `;
          badge.textContent = `API Online (PHP ${data.environment.phpVersion})`;
          brandContainer.appendChild(badge);
        }
      }
    } catch (error) {
      console.warn("Backend test failed:", error);
    }
  }

  // Initialize startup routines
  checkBackendConnection();
  loadIntentions();
});