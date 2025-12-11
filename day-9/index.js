const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "./src/views");

// dummyData
const dummyData = [
  {
    id: 1,
    subject: "Dummy 1",
    startDate: "2025-01-01",
    endDate: "2025-02-01",
    language: "C++",
    description: "DUMMY DATA 1",
    imageUrl: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    subject: "Dummy 2",
    startDate: "2025-03-01",
    endDate: "2025-04-01",
    language: "JavaScript",
    description: "DUMMY DATA 2",
    imageUrl: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    subject: "Dummy 3",
    startDate: "2025-05-01",
    endDate: "2025-06-01",
    language: "Python",
    description: "DUMMY DATA 3",
    imageUrl: "https://picsum.photos/200/300",
  },
];

app.use("/assets", express.static("./src/assets"));

// API route to fetch dummy projects
app.get("/api/projects", (req, res) => {
  res.json(dummyData);
});

app.get("/api/projects/:id", (req, res) => {
  const project = dummyData.find((p) => p.id == req.params.id);
  if (project) res.json(project);
  else res.status(404).json({ error: "Project not found" });
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
