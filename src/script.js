const navigate = document.querySelectorAll(".navigate");
const sidebar = document.getElementById("sidebar");
const barsMenu = document.getElementById("barsMenu");
const sidebarCloseButton = document.getElementById("sidebarCloseButton");
const searchBar = document.getElementById("searchBar");
const addBookBtn = document.getElementById("addBookBtn");
const addBookForm = document.getElementById("addBookForm");
const closeFormBtn = document.getElementById("closeFormBtn");
const listContainer = document.getElementById("listContainer");
const completedContainer = document.getElementById("completedContainer");
const greetingText = document.getElementById("greetingText");
const bannerDate = document.getElementById("bannerDate");
const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const yearInput = document.getElementById("yearInput");
const completedInput = document.getElementById("completedInput");
const formSubmitButton = document.getElementById("formSubmitButton");
const listRoot = document.getElementById("listRoot");
const completedRoot = document.getElementById("completedRoot");
const removeCardButton = document.querySelectorAll(".remove-card-button");
const allBookData = JSON.parse(localStorage.getItem("book-list")) || [];
const alertBox = document.getElementById("alertBox");
const alertText = document.getElementById("alertText");

// Set greetingText in Banner
const date = new Date();
const hour = date.getHours();
switch (true) {
  case hour < 12:
    greetingText.innerText = "Morning";
    break;
  case hour < 18:
    greetingText.innerText = "Afternoon";
    break;
  default:
    greetingText.innerText = "Night";
    break;
}

// Set Date in Banner
const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const isDate = `${day[date.getDay()]}, ${
  month[date.getMonth()]
} ${date.getDate()} ${date.getFullYear()}`;
bannerDate.innerText = isDate;

// Handle Sidebar Show
function showSidebar() {
  sidebar.style.left = "0";
}
function hideSidebar() {
  sidebar.style.left = "-100%";
}
barsMenu.addEventListener("click", showSidebar);
sidebarCloseButton.addEventListener("click", hideSidebar);

// Set Alert show and Alert Text
function setAlert(text) {
  alertText.innerText = text;
  alertBox.style.right = "0";
  setTimeout(() => {
    alertText.innerText = "";
    alertBox.style.right = "-100%";
  }, 3000);
}

// Set Show Page
function showListPage() {
  listContainer.style.left = "0%";
  completedContainer.style.right = "-100%";
}
function showCompletedPage() {
  listContainer.style.left = "-100%";
  completedContainer.style.right = "0%";
}
navigate.forEach((e) =>
  e.addEventListener("click", () =>
    e.innerText === "List" ? showListPage() : showCompletedPage()
  )
);

// Add book form show control
function showAddBookForm() {
  addBookForm.style.left = "0";
}
function hideAddBookForm() {
  addBookForm.style.left = "-100%";
}
addBookBtn.addEventListener("click", () => showAddBookForm());
closeFormBtn.addEventListener("click", () => hideAddBookForm());

// Search Bar
function handleSearchBar() {
  const searchTerm = searchBar.value.toLowerCase();
  const filteredData = allBookData.filter((book) => {
    const result = book.title.toLowerCase().includes(searchTerm);
    if (result) {
      console.log("isi");
      return result;
    } else {
      console.log("Kosong");
    }
  });

  listRoot.innerHTML = "";
  completedRoot.innerHTML = "";

  filteredData.forEach((book) => {
    createElement(book);
  });
}
searchBar.addEventListener("input", handleSearchBar);

// Add data to local storage
function addLocalStorage(data) {
  allBookData.push(data);
  localStorage.setItem("book-list", JSON.stringify(allBookData));
}

//Create Card Element
function createElement(bookData) {
  const div = document.createElement("div");
  const heading1 = document.createElement("h1");
  const heading4 = document.createElement("h4");
  const paragraph = document.createElement("p");
  const buttonSection = document.createElement("section");
  const bookDataSection = document.createElement("section");
  const button = document.createElement("button");
  const handleCompleteButton = document.createElement("button");

  heading1.innerText = `Title : ${bookData.title}`;
  heading4.innerText = `Author : ${bookData.author}`;
  paragraph.innerText = `Year : ${bookData.year}`;
  button.innerText = "Remove";

  div.classList.add("card-container");
  bookDataSection.classList.add("book-data-section");
  buttonSection.classList.add("button-section");
  button.classList.add("remove-card-button");
  handleCompleteButton.classList.add("handle-complete-button");

  div.setAttribute("card-id", bookData.id);

  if (!bookData.isComplete) {
    handleCompleteButton.innerText = "Mark as Completed";
  } else {
    handleCompleteButton.innerText = "Uncompleted";
  }

  bookDataSection.append(heading1);
  bookDataSection.append(heading4);
  bookDataSection.append(paragraph);
  buttonSection.append(button);
  buttonSection.append(handleCompleteButton);

  div.append(bookDataSection);
  div.append(buttonSection);

  if (!bookData.isComplete) {
    listRoot.appendChild(div);
  } else {
    completedRoot.appendChild(div);
  }
}

// Remove card button
function removeCard(id) {
  let index = allBookData.findIndex((e) => e.id == id);
  allBookData.splice(index, 1);
  localStorage.setItem("book-list", JSON.stringify(allBookData));
  setAlert("Removed Book");
}
document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-card-button")) {
    const divElement = e.target.closest("div");
    const id = divElement.getAttribute("card-id");
    divElement.remove();
    removeCard(id);
  }
});

// Toggle isCompleted book data
function isCompletedToggle(id) {
  const index = allBookData.findIndex((e) => e.id == id);
  const divElement = document.querySelector(`div[card-id="${id}"]`);

  if (allBookData[index].isComplete) {
    completedRoot.removeChild(divElement);
  } else {
    listRoot.removeChild(divElement);
  }

  const updatedData = {
    ...allBookData[index],
    isComplete: !allBookData[index].isComplete,
  };
  allBookData.splice(index, 1, updatedData);
  localStorage.setItem("book-list", JSON.stringify(allBookData));

  if (!updatedData.isComplete) {
    createElement(allBookData[index]);
    setAlert("Moved to Book List!");
  } else {
    createElement(allBookData[index]);
    setAlert("Moved to Completed List!");
  }
}
document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("handle-complete-button")) {
    const divElement = e.target.closest("div");
    const id = divElement.getAttribute("card-id");
    isCompletedToggle(id);
  }
});

// Reset form input
function resetFormInput() {
  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  completedInput.checked = false;
}

// Add new book form
function handleSubmit(e) {
  e.preventDefault();
  if (
    titleInput.value === "" ||
    authorInput.value === "" ||
    yearInput.value === ""
  ) {
    setAlert("Input Cannot be Empty!");
    return;
  }
  const bookData = {
    id: Date.now(),
    title: titleInput.value,
    author: authorInput.value,
    year: Number(yearInput.value),
    isComplete: completedInput.checked,
  };
  createElement(bookData);
  addLocalStorage(bookData);
  resetFormInput();
  setAlert("Book Added!");
}
formSubmitButton.addEventListener("click", (e) => handleSubmit(e));

// Display Data
function displayData() {
  allBookData.forEach((book) => {
    createElement(book);
  });
}
window.addEventListener("DOMContentLoaded", displayData);
