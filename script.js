document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("site-search");
  const searchBtn = document.getElementById("search-btn");
  const resultsContainer = document.getElementById("search-results");
  const resultsList = document.getElementById("results-list");
  const closeSearchBtn = document.getElementById("close-search");

  // Pages to search through
  const pages = [
    { name: "Home", url: "index.html" },
    { name: "About", url: "about.html" },
    { name: "Projects", url: "work.html" },
    { name: "Education", url: "education.html" },
    { name: "Contact", url: "contact.html" }
  ];

  function sanitizeDocument(doc) {
    const selectorsToRemove = [
      "script", "style", "noscript", "link", "meta",
      "header", "nav", "footer", "form", "input", "button",
      ".nav-wrap", ".nav", ".search-results", ".logo-square", ".brand"
    ];
    selectorsToRemove.forEach(sel => {
      doc.querySelectorAll(sel).forEach(n => n.remove());
    });
    return doc;
  }

  function extractVisibleText(html) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      sanitizeDocument(doc);
      let text = doc.body ? doc.body.textContent || "" : "";
      text = text.replace(/\s+/g, " ").trim();
      return text;
    } catch (e) {
      return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
  }

  function splitToSentences(text) {
    const parts = text.split(/(?<=[.?!])\s+/);
    return parts.map(s => s.trim()).filter(Boolean);
  }

  function findSentenceIndex(sentences, queryLower) {
    for (let i = 0; i < sentences.length; i++) {
      if (sentences[i].toLowerCase().includes(queryLower)) return i;
    }
    return -1;
  }

  function buildSnippet(sentences, matchIndex, contextSentences = 1) {
    const start = Math.max(0, matchIndex - contextSentences);
    const end = Math.min(sentences.length - 1, matchIndex + contextSentences);
    return sentences.slice(start, end + 1).join(" ");
  }

  function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(regex, `<mark style="background: yellow; color: black;">$1</mark>`);
  }

  async function performSearch() {
    const rawQuery = searchInput.value.trim();
    const queryLower = rawQuery.toLowerCase();
    resultsList.innerHTML = "";

    if (!rawQuery) {
      resultsList.innerHTML = `<div class="muted small">Type something and press Enter or click the search icon.</div>`;
      resultsContainer.hidden = false;
      return;
    }

    let foundAny = false;

    for (let page of pages) {
      try {
        const response = await fetch(page.url, { cache: "no-store" });
        if (!response.ok) continue;

        const html = await response.text();
        const visibleText = extractVisibleText(html);
        if (!visibleText) continue;

        const sentences = splitToSentences(visibleText);
        const matchIndex = findSentenceIndex(sentences, queryLower);

        if (matchIndex !== -1) {
          foundAny = true;

          const snippetRaw = buildSnippet(sentences, matchIndex, 1);
          const snippetHighlighted = highlight(snippetRaw, rawQuery);

          const resultItem = document.createElement("div");
          resultItem.className = "search-result-item";
          resultItem.style.cursor = "pointer";
          resultItem.style.padding = "10px";
          resultItem.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
          resultItem.addEventListener("click", () => {
            window.location.href = page.url;
          });

          resultItem.innerHTML = `
            <strong style="font-size:16px; color:#00fff7; display:block; margin-bottom:6px;">${page.name}</strong>
            <p style="margin:0; font-size:14px; color:#bbb; line-height:1.5;">${snippetHighlighted}</p>
          `;

          resultsList.appendChild(resultItem);
        }
      } catch (err) {
        console.error("Search fetch error for", page.url, err);
      }
    }

    if (!foundAny) {
      resultsList.innerHTML = `<p>No results found for "<strong>${rawQuery}</strong>"</p>`;
    }

    resultsContainer.hidden = false;
  }

  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
  });
  closeSearchBtn.addEventListener("click", () => {
    resultsContainer.hidden = true;
  });

  document.addEventListener("click", (ev) => {
    const panel = resultsContainer;
    if (!panel) return;
    const target = ev.target;
    if (!panel.contains(target) && !target.closest('.nav-wrap') && target !== searchInput && target !== searchBtn) {
      panel.hidden = true;
    }
  });

  const emailLink = document.getElementById("email-link");
  if (emailLink) {
    let tooltip;
    function showEmailTooltip(e) {
      e.preventDefault();
      if (tooltip) return;
      tooltip = document.createElement("div");
      tooltip.textContent = "riddhimanadak50@gmail.com";
      tooltip.style.position = "absolute";
      tooltip.style.background = "#222";
      tooltip.style.color = "#fff";
      tooltip.style.padding = "6px 10px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "14px";
      tooltip.style.zIndex = "9999";
      tooltip.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";
      const rect = emailLink.getBoundingClientRect();
      tooltip.style.top = rect.top + window.scrollY - 35 + "px";
      tooltip.style.left = rect.left + window.scrollX + "px";
      document.body.appendChild(tooltip);
    }
    function hideEmailTooltip() {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    }
    emailLink.addEventListener("mouseenter", showEmailTooltip);
    emailLink.addEventListener("mouseleave", hideEmailTooltip);
    emailLink.addEventListener("touchstart", showEmailTooltip);
    emailLink.addEventListener("touchend", hideEmailTooltip);
  }

const resumeBtn = document.getElementById("resume-btn");
if (resumeBtn) {
  resumeBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Save original text
    const originalText = resumeBtn.innerHTML;

    // Show temporary red message
    resumeBtn.innerHTML = `<span style="color: red;">Riddhi has not uploaded his resume yet</span>`;

    // Disable button during message
    resumeBtn.style.pointerEvents = "none";

    // Restore after 1 second
    setTimeout(() => {
      resumeBtn.innerHTML = originalText;
      resumeBtn.style.pointerEvents = "auto";
    }, 1500);
  });
}


});


/* ====== NEURON BACKGROUND CANVAS with CURSOR BOOST ====== */
(function(){
  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.id = "neuron-bg";
    document.body.prepend(canvas);
    canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "0";
canvas.style.pointerEvents = "auto"; // enable cursor/touch detection

    const ctx = canvas.getContext("2d");

    document.querySelectorAll(".container").forEach(c => c.classList.add("tech-front"));

    let w, h;
    let neurons = [];
    const numNeurons = 55;
    const maxDist = 160;

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      neurons = [];
      for (let i = 0; i < numNeurons; i++){
        neurons.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: 2 + Math.random() * 3,
          pulse: Math.random() * Math.PI * 2,
          boosted: false,
          boostTime: 0
        });
      }
    }
    window.addEventListener("resize", resize);
    resize();

    function boostNeuron(n){
      n.boosted = true;
      n.vx *= 8;
      n.vy *= 8;
      n.boostTime = Date.now();
    }

    function handlePointer(x,y){
      for (let n of neurons){
        let dx = n.x - x;
        let dy = n.y - y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 40){
          boostNeuron(n);
        }
      }
    }
    canvas.addEventListener("mousemove", e => handlePointer(e.clientX, e.clientY));
    canvas.addEventListener("touchstart", e => {
      for (let t of e.touches) handlePointer(t.clientX, t.clientY);
    }, {passive:true});

    function draw(){
      ctx.clearRect(0,0,w,h);

      // connections
      for (let i = 0; i < neurons.length; i++){
        let n1 = neurons[i];
        for (let j = i+1; j < neurons.length; j++){
          let n2 = neurons[j];
          let dx = n1.x - n2.x;
          let dy = n1.y - n2.y;
          let dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < maxDist){
            const alpha = 1 - dist / maxDist;
            ctx.strokeStyle = `rgba(0,255,247,${alpha*0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }



      
      // neurons
      for (let n of neurons){
        if (n.boosted){
          let elapsed = (Date.now() - n.boostTime) / 1000;
          if (elapsed > 5){
            n.boosted = false;
          } else {
            n.vx *= 0.97;
            n.vy *= 0.97;
          }
        }

        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.05;

        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        const glow = (Math.sin(n.pulse) + 1) * 0.5;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r*6);
        grad.addColorStop(0, `rgba(0,255,247,${0.6+0.4*glow})`);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r*6, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = n.boosted ? "#ff4d4d" : "#00fff7";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }
    draw();
  });
})();
/* ===== STARFIELD 3D BACKGROUND ===== */
(function(){
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars = [];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 500; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w
      });
    }
  }
  window.addEventListener("resize", resize);
  resize();

  function animate(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w,h);

    ctx.fillStyle = "white";
    for (let s of stars) {
      s.z -= 4; // star speed
      if (s.z <= 0) s.z = w;

      let k = 128.0 / s.z;
      let px = s.x * k + w/2;
      let py = s.y * k + h/2;

      if (px >= 0 && px < w && py >= 0 && py < h) {
        let size = (1 - s.z / w) * 2;
        ctx.fillRect(px, py, size, size);
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

(function(){
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars = [];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 500; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w
      });
    }
  }
  window.addEventListener("resize", resize);
  resize();

  function animate(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w,h);

    ctx.fillStyle = "white";
    for (let s of stars) {
      s.z -= 4;
      if (s.z <= 0) s.z = w;

      let k = 128.0 / s.z;
      let px = s.x * k + w/2;
      let py = s.y * k + h/2;

      if (px >= 0 && px < w && py >= 0 && py < h) {
        let size = (1 - s.z / w) * 2;
        ctx.fillRect(px, py, size, size);
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();


