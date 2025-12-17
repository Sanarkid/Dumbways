document.addEventListener("DOMContentLoaded", loadDetail);

async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  const res = await fetch(`/api/projects/${id}`);
  const project = await res.json();

  const detailDiv = document.getElementById("details");

  detailDiv.innerHTML = `
    <img src="${project.image_url || "https://via.placeholder.com/400x200"}"
         class="img-fluid rounded"
         alt="${project.title}">
    
    <h2 class="text-center pt-3">${project.title}</h2>

    <p>${project.description}</p>

    <p>From: ${formatDate(project.start_date)}  
       To: ${formatDate(project.end_date)}</p>

    <p>Language: ${project.language}</p>
  `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
