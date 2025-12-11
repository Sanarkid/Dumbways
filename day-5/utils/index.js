const submitAction = document.getElementById("addMyProject");
const contents = document.getElementById("contents");

if (!contents) {
  console.error("Element with ID 'contents' not found.");
}

// --- Card Maker Function ---
function cardMaker({
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

  const button = document.createElement("button");
  button.className = "btn btn-dark px-5 py-1 mt-auto align-self-center";
  button.textContent = "Lihat Detail";

  // Event klik tombol
  button.addEventListener("click", () => {
    // Simpan data proyek ke localStorage sementara
    localStorage.setItem(
      "selectedProject",
      JSON.stringify({
        imageUrl,
        title,
        description,
        startDate,
        endDate,
        language,
      })
    );

    // Arahkan ke halaman detail
    window.location.href = "details.html";
  });

  card.appendChild(image);
  card.appendChild(h4);
  card.appendChild(pDesc);
  card.appendChild(meta);
  card.appendChild(button);

  if (contents) contents.append(card);
}

// --- Render projects from localStorage on page load ---
document.addEventListener("DOMContentLoaded", () => {
  const projects = JSON.parse(localStorage.getItem("project")) || [];
  projects.forEach((project) => {
    cardMaker({
      imageUrl: project.imageUrl,
      title: project.subject,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      language: project.language,
    });
  });
});

// --- Handle form submission ---
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

      // Render card immediately
      cardMaker({
        imageUrl: imageDataUrl,
        title: formSubject,
        description: formDescription,
        startDate: formStartDate,
        endDate: formEndDate,
        language: formLanguage,
      });

      // Save project into localStorage
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
    // If no image uploaded, still save project
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
