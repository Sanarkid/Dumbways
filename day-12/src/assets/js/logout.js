// tombol logout
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logOut").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login";
  });
});