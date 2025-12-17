const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadProject() {
  const res = await fetch(`/api/projects/${id}`);
  const project = await res.json();

  document.getElementById("formSubject").value = project.title;
  document.getElementById("formStartDate").value =
    project.start_date.split("T")[0];
  document.getElementById("formEndDate").value = project.end_date.split("T")[0];
  document.getElementById("formLanguage").value = project.language;
  document.getElementById("formDescription").value = project.description;
}

loadProject();

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("formSubject").value);
  formData.append("startDate", document.getElementById("formStartDate").value);
  formData.append("endDate", document.getElementById("formEndDate").value);
  formData.append("language", document.getElementById("formLanguage").value);
  formData.append(
    "description",
    document.getElementById("formDescription").value
  );

  const fileInput = document.getElementById("formFile");
  if (fileInput.files[0]) {
    formData.append("image", fileInput.files[0]);
  }
  await fetch(`/api/projects/${id}`, {
    method: "PUT",
    body: formData,
  });

  window.location.href = "/my-projects";
});
