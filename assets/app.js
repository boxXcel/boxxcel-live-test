// Configuration values (loaded from config.json)
let COGNITO_DOMAIN = "";
let CLIENT_ID = "";
let LOGOUT_URI = "";

// Initialize config
(async function initAppConfig() {
  try {
    const config = await CONFIG.load();
    COGNITO_DOMAIN = config.cognitoDomain;
    CLIENT_ID = config.clientId;
    LOGOUT_URI = config.logoutUri;
  } catch (e) {
    console.error("Failed to load config in app.js:", e);
    // Fallback to hardcoded values
    COGNITO_DOMAIN = "https://eu-west-2744agx2nc.auth.eu-west-2.amazoncognito.com";
    CLIENT_ID = "1hhh6m6lhs126argcqac9h93rc";
    LOGOUT_URI = "https://www.boxxcel.com/";
  }
})();

function decodeJwtPayload(token) {
  const part = token.split(".")[1];
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  return JSON.parse(atob(padded));
}

function getUserEmail() {
  try {
    const t = localStorage.getItem("id_token");
    if (!t) return "";
    return decodeJwtPayload(t).email || "";
  } catch {
    return "";
  }
}

function logout() {
  localStorage.clear();
  const url =
    COGNITO_DOMAIN +
    "/logout" +
    "?client_id=" +
    encodeURIComponent(CLIENT_ID) +
    "&logout_uri=" +
    encodeURIComponent(LOGOUT_URI);
  window.location.href = url;
}

function renderTopbar(title) {
  const el = document.querySelector("[data-topbar]");
  if (!el) return;

  el.innerHTML = `
    <div class="brand">
      <img src="/logo.png" alt="boxXcel">
      <div class="title">${title} ${getUserEmail() ? "— " + getUserEmail() : ""}</div>
    </div>
    <button class="btn secondary" id="logoutBtn" type="button">Logout</button>
  `;

  const btn = document.getElementById("logoutBtn");
  if (btn) btn.onclick = logout;
}

function renderNav() {
  const el = document.querySelector("[data-nav]");
  if (!el) return;

  // Side nav (left)
  el.innerHTML = `
    <div class="nav">
      <a href="/boxer/index.html">Dashboard</a>
      <a href="/boxer/training.html">Training</a>
      <a href="/boxer/weight.html">Weight</a>
      <a href="/boxer/profile.html">Profile</a>

      <hr />

      <a href="/parent/training.html">Parent – Training</a>
      <a href="/parent/progress.html">Parent – Progress</a>
    </div>
  `;

  // Highlight current
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href && window.location.pathname.endsWith(href)) {
      a.classList.add("active");
    }
  });
}
