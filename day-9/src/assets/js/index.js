const submitAction = document.getElementById("addMyProject");
const contents = document.getElementById("contents");

if (!contents) {
  console.error("Element with ID 'contents' not found.");
}

// --- Card Maker Function ---
function cardMaker({
  id,
  imageUrl,
  title,
  description,
  startDate,
  endDate,
  language,
}) {
  const card = document.createElement("div");
  card.className =
    "bg-white shadow rounded overflow-hidden p-3 d-flex flex-column w-64 text-dark fixbox";

  const image = document.createElement("img");
  image.className = "w-100 img-fluid object-fit-cover rounded";
  image.alt = title || "Project Image";
  image.src = imageUrl || "https://via.placeholder.com/400x200?text=No+Image";

  const h4 = document.createElement("h4");
  h4.className = "fs-5 fw-semibold mb-2 text-center";
  h4.textContent = title || "No Title";

  const pDesc = document.createElement("p");
  pDesc.className = "fs-6 text-muted mb-4 text-center line-clamp-2";
  pDesc.textContent = description || "No Description";

  const meta = document.createElement("div");
  meta.className = "small text-muted mb-4";
  meta.textContent = `From: ${startDate || "N/A"} To: ${endDate || "N/A"} · ${
    language || "N/A"
  }`;

  // Bungkus tombol dalam btn-group
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "btn-group mt-auto d-flex justify-content-center";

  // Tombol detail
  const buttonDetail = document.createElement("button");
  buttonDetail.className = "btn btn-dark";
  buttonDetail.textContent = "Detail";

  buttonDetail.addEventListener("click", () => {
    localStorage.setItem(
      "selectedProject",
      JSON.stringify({
        id,
        imageUrl,
        title,
        description,
        startDate,
        endDate,
        language,
      })
    );
    window.location.href = `details?id=${id}`;
  });

  // Tombol edit
  const buttonEdit = document.createElement("button");
  buttonEdit.className = "btn btn-light border-dark";
  buttonEdit.textContent = "Edit";

  // Event listener untuk tombol edit
  buttonEdit.addEventListener("click", () => {
    localStorage.setItem("editingProjectId", id);
    window.location.href = `edit?id=${id}`;
  });

  // Tombol hapus
  const buttonDelete = document.createElement("button");
  buttonDelete.className = "btn btn-dark";
  buttonDelete.textContent = "Hapus";

  // Event listener untuk tombol hapus
  buttonDelete.addEventListener("click", () => {
    // Ambil semua project dari localStorage
    let projects = JSON.parse(localStorage.getItem("project")) || [];

    // Filter project yang bukan dengan id ini
    projects = projects.filter((p) => p.id !== id);

    // Simpan kembali ke localStorage
    localStorage.setItem("project", JSON.stringify(projects));

    // Hapus card dari tampilan
    card.remove();
  });

  // Masukkan tombol ke dalam group
  buttonGroup.appendChild(buttonDetail);
  buttonGroup.appendChild(buttonEdit);
  buttonGroup.appendChild(buttonDelete);

  // Tambahkan group ke card
  card.appendChild(image);
  card.appendChild(h4);
  card.appendChild(pDesc);
  card.appendChild(meta);
  card.appendChild(buttonGroup);

  if (contents) contents.append(card);
}

// --- Load proyek pada local storage ---
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Fetch dummy data from Express
  let dummyProjects = [];
  try {
    const res = await fetch("/api/projects");
    dummyProjects = await res.json();
  } catch (err) {
    console.error("Failed to fetch dummy projects:", err);
  }

  // 2. Load projects from localStorage
  const localProjects = JSON.parse(localStorage.getItem("project")) || [];

  // 3. Merge them (dummy first, then local)
  const allProjects = [...dummyProjects, ...localProjects];

  // 4. Render cards
  allProjects.forEach((project) =>
    cardMaker({
      id: project.id,
      imageUrl: project.imageUrl,
      title: project.subject,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      language: project.language,
    })
  );
});

// --- Handler form submission ---
submitAction.addEventListener("submit", function (e) {
  e.preventDefault();

  const formSubject = document.getElementById("formSubject")?.value;
  const formStartDate = document.getElementById("formStartDate")?.value;
  const formEndDate = document.getElementById("formEndDate")?.value;
  const formLanguage = document.getElementById("formLanguage")?.value;
  const formDescription = document.getElementById("formDescription")?.value;
  const formFile = document.getElementById("formFile");
  const imageUploaded =
    formFile && formFile.files[0] ? formFile.files[0] : null;

  if (imageUploaded) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageDataUrl = e.target.result; //

      // Render card
      cardMaker({
        id: Date.now(),
        imageUrl: imageDataUrl,
        title: formSubject,
        description: formDescription,
        startDate: formStartDate,
        endDate: formEndDate,
        language: formLanguage,
      });

      // Save project ke localStorage
      const newProject = {
        id: Date.now(),
        subject: formSubject,
        startDate: formStartDate,
        endDate: formEndDate,
        language: formLanguage,
        description: formDescription,
        imageUrl: imageDataUrl,
      };

      let project = JSON.parse(localStorage.getItem("project")) || [];
      project.push(newProject);
      localStorage.setItem("project", JSON.stringify(project));

      submitAction.reset();
    };
    reader.readAsDataURL(imageUploaded);
  } else {
    // jika tak ada gambar, pakai placeholder
    const newProject = {
      id: Date.now(),
      subject: formSubject,
      startDate: formStartDate,
      endDate: formEndDate,
      language: formLanguage,
      description: formDescription,
      imageUrl: null,
    };

    cardMaker(newProject);

    let project = JSON.parse(localStorage.getItem("project")) || [];
    project.push(newProject);
    localStorage.setItem("project", JSON.stringify(project));

    console.table(newProject);
    submitAction.reset();
  }
});
