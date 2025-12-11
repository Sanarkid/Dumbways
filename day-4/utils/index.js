const submitAction = document.getElementById("addMyProject");

submitAction.addEventListener("submit", function (e) {
  const formSubject = document.getElementById("formSubject").value;
  const formStartDate = document.getElementById("formStartDate").value;
  const formEndDate = document.getElementById("formEndDate").value;
  const formLanguage = document.getElementById("formLanguage").value;
  const formDescription = document.getElementById("formDescription").value;
  const formFile = document.getElementById("formFile").files[0];
  const text1 = `Judul Project: ${formSubject}`;
  const text2 = `Deskripsi Project: ${formDescription}`;

  document.getElementById("hasilFormSubject").innerHTML = text1;
  document.getElementById("hasilFormDescription").innerHTML = text2;
  e.preventDefault();

  console.table([
    { label: "Subject", value: formSubject },
    { label: "Start Date", value: formStartDate },
    { label: "End Date", value: formEndDate },
    { label: "Language", value: formLanguage },
    { label: "Description", value: formDescription },
    { label: "File", value: formFile },
  ]);
});
