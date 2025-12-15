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
  buttonDelete.addEventListener("click", async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

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
  try {
    const res = await fetch("/api/projects");
    const projects = await res.json();

    projects.forEach((project) =>
      cardMaker({
        id: project.id,
        imageUrl: project.image_url,
        title: project.title,
        description: project.description,
        startDate: formatDate(project.start_date),
        endDate: formatDate(project.end_date),
        language: project.language,
      })
    );
  } catch (err) {
    console.error("Failed to load projects:", err);
  }
});

// --- Format Tanggal ---
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// --- Handler form submission ---
submitAction.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formSubject = document.getElementById("formSubject")?.value;
  const formStartDate = document.getElementById("formStartDate")?.value;
  const formEndDate = document.getElementById("formEndDate")?.value;
  const formLanguage = document.getElementById("formLanguage")?.value;
  const formDescription = document.getElementById("formDescription")?.value;
  const formFile = document.getElementById("formFile");
  const imageUploaded = formFile?.files[0] || null;
  // Jika ada gambar yang diunggah
  if (imageUploaded) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      const imageDataUrl = e.target.result;

      const newProject = {
        title: formSubject,
        startDate: formStartDate,
        endDate: formEndDate,
        language: formLanguage,
        description: formDescription,
        imageUrl: imageDataUrl,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      const saved = await res.json();

      cardMaker({
        id: saved.id,
        imageUrl: saved.image_url,
        title: saved.title,
        description: saved.description,
        startDate: formatDate(saved.start_date),
        endDate: formatDate(saved.end_date),
        language: saved.language,
      });

      submitAction.reset();
    };

    reader.readAsDataURL(imageUploaded);
  }
  // Jika tidak ada gambar yang diunggah
  else {
    const newProject = {
      title: formSubject,
      startDate: formStartDate,
      endDate: formEndDate,
      language: formLanguage,
      description: formDescription,
      imageUrl: null,
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });

    const saved = await res.json();

    cardMaker({
      id: saved.id,
      imageUrl: saved.image_url,
      title: saved.title,
      description: saved.description,
      startDate: formatDate(saved.start_date),
      endDate: formatDate(saved.end_date),
      language: saved.language,
    });

    submitAction.reset();
  }
});
