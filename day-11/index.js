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
