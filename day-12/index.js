const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use("/assets", express.static("./src/assets"));

const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dumbways",
  password: "admin123",
  port: 5432,
});

// API untuk GET data proyek
app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM my_projects ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API untuk CREATE data proyek
app.use(express.json());
app.post("/api/projects", async (req, res) => {
  const { title, startDate, endDate, language, description, imageUrl } =
    req.body;

  try {
    const result = await pool.query(
      `INSERT INTO my_projects (title, start_date, end_date, language, description, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, startDate, endDate, language, description, imageUrl]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete API untuk DELETE data proyek
app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM my_projects WHERE id = $1", [id]);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API untuk register akun
const bcrypt = require("bcrypt");

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password, createdat)
      VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [username, email, hashedPassword]
    );
    res.json(result.rows[0]); //kirim kembali user yang baru
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API untuk login akun
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    //cari username di database
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).send("Username tidak ditemukan");
    }

    const user = result.rows[0];
    // bandingkan password dari login dengan database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Password Salah");
    }

    // Login Sukses
    res.json({
      message: "Login Sukses",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/home", (req, res) => {
  res.render("index");
});

app.get("/my-projects", (req, res) => {
  res.render("my-projects");
});

app.get("/contact", (req, res) => {
  res.render("form");
});

app.get("/details", (req, res) => {
  res.render("details");
});

app.get("/edit", (req, res) => {
  res.render("edit");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
