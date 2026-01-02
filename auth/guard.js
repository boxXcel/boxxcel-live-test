// auth/guard.js
(function () {
  function decodeJwtPayload(token) {
    const part = token.split(".")[1];
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "===".slice((normalized.length + 3) % 4);
    return JSON.parse(atob(padded));
  }

  function isJwtExpired(token) {
    try {
      const payload = decodeJwtPayload(token);
      return (payload.exp * 1000) <= Date.now();
    } catch {
      return true;
    }
  }

  const token = localStorage.getItem("access_token");
  const valid = token && !isJwtExpired(token);

  if (!valid) {
    window.location.replace("/");
  }
})();
