let username = document.querySelector(".username");
let password = document.querySelector(".password");
let loginBtn = document.getElementById("loginBtn");
let loginForm = document.querySelector(".loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (username.value === "shoh" && password.value === "123") {
    password.classList.remove("errorBorder");
    username.classList.remove("errorBorder");
    window.location.replace("../admin.html");
    loginForm.reset();
  } else {
    password.classList.add("errorBorder");
    username.classList.add("errorBorder");
  }
});
