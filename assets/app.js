const COGNITO_DOMAIN = "https://eu-west-2744agx2nc.auth.eu-west-2.amazoncognito.com";
const CLIENT_ID = "1hhh6m6lhs126argcqac9h93rc";
const LOGOUT_URI = "https://www.boxxcel.com/";

function decodeJwtPayload(token) {
  const part = token.split(".")[1];
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  return JSON.parse(atob(padded));
}

function getUserEmail(){
  try{
    const t = localStorage.getItem("id_token");
    if(!t) return "";
    return decodeJwtPayload(t).email || "";
  }catch{
    return "";
  }
}

function logout(){
  localStorage.clear();
  const url =
    COGNITO_DOMAIN + "/logout" +
    "?client_id=" + encodeURIComponent(CLIENT_ID) +
    "&logout_uri=" + encodeURIComponent(LOGOUT_URI);
  window.location.href = url;
}

function renderTopbar(title){
  const el = document.querySelector("[data-topbar]");
  if(!el) return;

  el.innerHTML = `
    <div class="brand">
      <img src="/logo.png">
      <div class="title">${title} ${getUserEmail() ? "— " + getUserEmail() : ""}</div>
    </div>
    <button class="btn secondary" id="logoutBtn">Logout</button>
  `;

  document.getElementById("logoutBtn").onclick = logout;
}

function renderNav(){
  const el = document.querySelector("[data-nav]");
  if(!el) return;

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

  document.querySelectorAll(".nav a").forEach(a=>{
    if(window.location.pathname.endsWith(a.getAttribute("href"))){
      a.classList.add("active");
    }
  });
}

// -----------------------------
// Settings helpers (global)
// -----------------------------
const SETTINGS_STORAGE_KEY = "boxxcel_settings_v1";

function getSettings(){
  try { return JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}"); }
  catch { return {}; }
}

function setSettings(next){
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next || {}));
}

function getBoxerId(){
  const s = getSettings();
  return (s.boxer_id || "").trim();
}

function setBoxerId(id){
  const s = getSettings();
  s.boxer_id = String(id || "").trim();
  setSettings(s);
}

