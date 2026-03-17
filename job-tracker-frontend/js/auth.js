const API_BASE = "http://localhost:8080";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(API_BASE + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Login failed. Please check your credentials.");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.name);
    window.location.href = "dashboard.html";
  } catch (e) {
    console.error("Login error:", e);
    alert("Connection error. Is the backend running?");
  }
}

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(API_BASE + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      alert("Registration failed. Email might already be in use.");
      return;
    }

    alert("Registration successful! Please sign in.");
    window.location.href = "login.html";
  } catch (e) {
    console.error("Register error:", e);
    alert("Connection error. Is the backend running?");
  }
}
