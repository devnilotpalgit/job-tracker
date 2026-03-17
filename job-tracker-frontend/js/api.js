const API_BASE = "http://localhost:8080";

function getToken() {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return token;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

async function apiRequest(endpoint, method = "GET", body = null) {
  const token = getToken();
  if (!token) {
    console.warn("No token found. Redirecting to login.");
    window.location.href = "login.html";
    return Promise.reject("Unauthorized");
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(API_BASE + endpoint, options);

  if (res.status === 401 || res.status === 403) {
    logout(); 
    return Promise.reject("Unauthorized");
  }

  if (!res.ok) {
    throw new Error("Request failed with status " + res.status);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
