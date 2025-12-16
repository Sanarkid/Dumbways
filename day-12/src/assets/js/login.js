const form = document.getElementById("login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const loginData = { username, password };

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (!res.ok) {
      const error = await res.text();
      alert(error);
      return;
    }

    const data = await res.json();
    alert("Login Sukses!");

    // simpan info user di localstorage
    localStorage.setItem("user", JSON.stringify(data.user));

    // lanjut ke homepage
    window.location.href = "home";
  } catch (err) {
    console.error("Login Gagal: ", err);
  }
});
