const form = document.getElementById("register");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Password tidak sama!");
    return;
  }

  const newUser = { username, email, password };

  try {
    const res = await fetch("api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      alert("Registrasi Sukses!");
      window.location.href = "login";
    } else {
      const error = await res.text();
      alert("Error: " + Error);
    }
  } catch (err) {
    console.error("Gagal Register: ", err);
  }
});
