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