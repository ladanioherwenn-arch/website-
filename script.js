const envelope = document.getElementById("envelope");
const container = document.getElementById("envelopeContainer");
const closeBtn = document.getElementById("closeBtn");
const topPill = document.getElementById("topPill");
const sparkleLayer = document.querySelector(".sparkle-layer");

let running = false;
let petalTimer = null;
let heartTimer = null;

// performance: limit how many floating elements exist
const LIMIT = {
  petals: 120,
  hearts: 40
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}

/* ===== Sparkles once ===== */
function makeSparkles(count = 90) {
  sparkleLayer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    const size = random(1, 4);
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.top = `${random(0, window.innerHeight)}px`;
    s.style.left = `${random(0, window.innerWidth)}px`;
    s.style.animationDuration = `${random(1.6, 4.5)}s`;
    sparkleLayer.appendChild(s);
  }
}
makeSparkles();
window.addEventListener("resize", () => makeSparkles());

/* ===== Helpers to keep DOM light ===== */
function countOnScreen(className) {
  return document.getElementsByClassName(className).length;
}

/* ===== Effects ===== */
function spawnPetal() {
  if (countOnScreen("petal") > LIMIT.petals) return;

  const petal = document.createElement("div");
  petal.className = "petal";

  const colors = ["#ff6f91", "#ffb3c1", "#ffd1dc", "#ffa07a", "#ff69b4", "#f9a825"];
  petal.style.background = colors[Math.floor(random(0, colors.length))];

  const size = random(10, 18);
  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.left = `${random(0, window.innerWidth)}px`;

  petal.style.setProperty("--s", random(0.6, 1.4));
  petal.style.setProperty("--x", `${random(-180, 180)}px`);
  petal.style.setProperty("--r", `${random(180, 900)}deg`);

  const dur = random(5.5, 10);
  petal.style.animationDuration = `${dur}s`;

  document.body.appendChild(petal);
  petal.addEventListener("animationend", () => petal.remove());
}

function spawnHeart() {
  if (countOnScreen("heart") > LIMIT.hearts) return;

  const heart = document.createElement("div");
  heart.className = "heart";
  heart.style.left = `${random(0, window.innerWidth)}px`;
  heart.style.setProperty("--hx", `${random(-240, 240)}px`);
  heart.style.animationDuration = `${random(3, 6)}s`;

  document.body.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove());
}

function startEffects() {
  if (running) return;
  running = true;

  // smoother + not too heavy
  petalTimer = setInterval(spawnPetal, 90);
  heartTimer = setInterval(spawnHeart, 260);

  topPill.style.opacity = "0";
  topPill.style.pointerEvents = "none";
}

function stopEffects() {
  running = false;

  if (petalTimer) clearInterval(petalTimer);
  if (heartTimer) clearInterval(heartTimer);

  petalTimer = null;
  heartTimer = null;
}

/* ===== Open / Close ===== */
function openEnvelope() {
  envelope.classList.add("open");
  startEffects();
}

function closeEnvelope() {
  envelope.classList.remove("open");
  stopEffects();
  topPill.style.opacity = "1";
  topPill.style.pointerEvents = "auto";
}

/* Click / tap */
container.addEventListener("click", () => {
  // toggle
  if (envelope.classList.contains("open")) closeEnvelope();
  else openEnvelope();
});

/* Keyboard support */
container.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (envelope.classList.contains("open")) closeEnvelope();
    else openEnvelope();
  }
});

closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeEnvelope();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeEnvelope();
});