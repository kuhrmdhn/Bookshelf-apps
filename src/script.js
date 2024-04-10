const navigate = document.querySelectorAll(".navigate");
const addBook = document.getElementById("addBook");
const closeAddBookForm = document.getElementById("closeAddBookForm");
const bookListContainer = document.querySelector(".bookList-container");
const bookmarkContainer = document.querySelector(".bookmark-container");
const addBookForm = document.getElementById("addBookForm");

function showAddBookForm() {
  addBookForm.style.right = "0";
}
function hideAddBookForm() {
  addBookForm.style.right = "-100%";
}
function showBookListPage() {
  bookListContainer.style.left = "0%";
  bookmarkContainer.style.right = "-100%";
}
function showBookmarkPage() {
  bookmarkContainer.style.right = "0";
  bookListContainer.style.left = "-100%";
}
addBook.addEventListener("click", showAddBookForm);
closeAddBookForm.addEventListener("click", hideAddBookForm);
navigate.forEach((e) => {
  e.addEventListener("click", () => {
    e.innerText === "Book List" ? showBookListPage() : showBookmarkPage();
  });
});

const bookTitle = document.getElementById("bookTitle");
const bookImage = document.getElementById("bookImage");
const bookAuthor = document.getElementById("bookAuthor");
const bookYear = document.getElementById("bookYear");
const isBookmark = document.getElementById("isBookmark");
const addBookSubmitBtn = document.querySelector(".add-book-submit-btn");
const bookListRoot = document.getElementById("bookListRoot");
const bookmarkRoot = document.getElementById("bookmarkRoot");

function resetInputValue() {
  bookTitle.value = "";
  bookImage.value = "";
  bookAuthor.value = "";
  bookYear.value = "";
  isBookmark.checked = false;
}
function hideAllRootChild() {
  bookListRoot.innerHTML = "";
  bookmarkRoot.innerHTML = "";
}
function handleAddBook(e) {
  if (
    bookTitle.value === "" ||
    bookAuthor.value === "" ||
    bookYear.value == 0
  ) {
    showAlertBox("Input Can't Empty!");
    return;
  }
  e.preventDefault();
  const bookData = {
    id: Date.now(),
    title: bookTitle.value,
    image: bookImage.value,
    author: bookAuthor.value,
    year: Number(bookYear.value),
    isBookmark: isBookmark.checked,
  };
  createCardElement(
    bookData.id,
    bookData.title,
    bookData.image,
    bookData.author,
    bookData.year,
    bookData.isBookmark
  );
  hideAddBookForm();
  resetInputValue();
  addLocalStorage(bookData);
  showAlertBox("Success to Add New Book!");
}
function createCardElement(id, title, image, author, year, isBookmark) {
  const divContainer = document.createElement("div");
  const bookDataList = document.createElement("ul");
  const buttonContainer = document.createElement("section");
  const bookImageList = document.createElement("img");
  const bookTitleList = document.createElement("li");
  const bookAuthorList = document.createElement("li");
  const bookYearList = document.createElement("li");
  const handleBookmarkBtn = document.createElement("button");
  const handleDeleteBtn = document.createElement("button");
  const handleEditBtn = document.createElement("button");

  divContainer.setAttribute("card-id", id);
  bookTitleList.setAttribute("title", title);
  bookImageList.setAttribute("alt", title);
  image !== ""
    ? bookImageList.setAttribute("src", image)
    : bookImageList.setAttribute("src", "/public/unknown_book.webp");

  divContainer.classList.add("book-card-container");
  handleEditBtn.classList.add("fa-solid", "fa-pen", "edit-card-btn");
  handleDeleteBtn.classList.add("fa-solid", "fa-trash", "remove-card-btn");
  isBookmark
    ? handleBookmarkBtn.classList.add(
        "fa-solid",
        "fa-bookmark",
        "bookmark-card-btn"
      )
    : handleBookmarkBtn.classList.add(
        "fa-solid",
        "fa-book-bookmark",
        "bookmark-card-btn"
      );

  bookTitleList.innerText = title;
  bookAuthorList.innerText = `Author:  ${author}`;
  bookYearList.innerText = `Year: ${year}`;

  buttonContainer.appendChild(handleEditBtn);
  buttonContainer.appendChild(handleBookmarkBtn);
  buttonContainer.appendChild(handleDeleteBtn);
  bookDataList.appendChild(bookTitleList);
  bookDataList.appendChild(bookAuthorList);
  bookDataList.appendChild(bookYearList);
  bookDataList.appendChild(buttonContainer);
  divContainer.appendChild(bookImageList);
  divContainer.appendChild(bookDataList);

  isBookmark
    ? bookmarkRoot.appendChild(divContainer)
    : bookListRoot.appendChild(divContainer);
}

addBookSubmitBtn.addEventListener("click", (e) => handleAddBook(e));

const bookStorage = JSON.parse(localStorage.getItem("bookStorage")) || [];
function loadBookData() {
  bookStorage.forEach((book) =>
    createCardElement(
      book.id,
      book.title,
      book.image,
      book.author,
      book.year,
      book.isBookmark
    )
  );
}

function addLocalStorage(data) {
  bookStorage.push(data);
  localStorage.setItem("bookStorage", JSON.stringify(bookStorage));
}

function setLocalStorage(data) {
  localStorage.setItem("bookStorage", JSON.stringify(data));
}

const editBookForm = document.getElementById("editBookForm");
const closeEditBookForm = document.getElementById("closeEditBookForm");
const currentBookId = document.getElementById("currentBookId");
const currentBookTitle = document.getElementById("currentBookTitle");
const currentBookImage = document.getElementById("currentBookImage");
const currentBookAuthor = document.getElementById("currentBookAuthor");
const currentBookYear = document.getElementById("currentBookYear");
const currentIsBookmark = document.getElementById("currentIsBookmark");
const submitEditBookForm = document.getElementById("submitEditBookForm");

function handleBookmark(bookCard) {
  const cardId = Number(bookCard.getAttribute("card-id"));
  const bookIndex = bookStorage.findIndex((book) => book.id === cardId);
  const currentBookCard = bookStorage[bookIndex];
  const updatedBookData = bookStorage[bookIndex];
  const newBookmarkStatus = !currentBookCard.isBookmark;
  currentBookCard.isBookmark = newBookmarkStatus;
  createCardElement(
    currentBookCard.id,
    currentBookCard.title,
    currentBookCard.image,
    currentBookCard.author,
    currentBookCard.year,
    currentBookCard.isBookmark
  );
  addLocalStorage(updatedBookData);
  handleDeleteCard(bookCard);
  newBookmarkStatus
    ? showAlertBox("Added to Bookmark!")
    : showAlertBox("Added to Book List");
}
function handleDeleteCard(bookCard) {
  bookCard.remove();
  const cardId = Number(bookCard.getAttribute("card-id"));
  const bookIndex = bookStorage.findIndex((book) => book.id === cardId);
  bookStorage.splice(bookIndex, 1);
  setLocalStorage(bookStorage);
  showAlertBox("Success to Remove Book!");
}
function showEditBookForm(bookCard) {
  editBookForm.style.right = "0";
  const currentCardId = Number(bookCard.getAttribute("card-id"));
  const currentBookData = bookStorage.find((book) => book.id === currentCardId);
  currentBookId.innerText = currentBookData.id;
  currentBookTitle.value = currentBookData.title;
  currentBookImage.value = currentBookData.image;
  currentBookAuthor.value = currentBookData.author;
  currentBookYear.value = currentBookData.year;
  currentIsBookmark.checked = currentBookData.isBookmark;
}
function hideEditBookForm() {
  editBookForm.style.right = "-100%";
  currentBookId.innerText = "";
  currentBookTitle.value = "";
  currentBookImage.value = "";
  currentBookAuthor.value = "";
  currentBookYear.value = "";
  currentIsBookmark.checked = false;
}
function submitEditedBookData(e) {
  if (
    currentBookTitle.value === "" ||
    currentBookAuthor.value === "" ||
    currentBookYear.value == 0
  ) {
    showAlertBox("Input Can't Empty!");
    return;
  }
  e.preventDefault();
  const bookIndex = bookStorage.findIndex(
    (book) => book.id === currentBookId.innerText
  );
  const newData = {
    id: Number(currentBookId.innerText),
    title: currentBookTitle.value,
    image: currentBookImage.value,
    author: currentBookAuthor.value,
    year: Number(currentBookYear.value),
    isBookmark: currentIsBookmark.checked,
  };
  bookStorage.splice(bookIndex, 1, newData);
  setLocalStorage(bookStorage);
  hideAllRootChild();
  loadBookData();
  hideEditBookForm();
  showAlertBox("Success to Edit Book Data, Data Will be Saved!");
}

closeEditBookForm.addEventListener("click", hideEditBookForm);
submitEditBookForm.addEventListener("click", submitEditedBookData);
document.body.addEventListener("click", (element) => {
  if (element.target.classList.contains("bookmark-card-btn")) {
    const cardElement = element.target.closest("div");
    handleBookmark(cardElement);
  }
});

document.body.addEventListener("click", (element) => {
  if (element.target.classList.contains("remove-card-btn")) {
    const cardElement = element.target.closest("div");
    handleDeleteCard(cardElement);
  }
});
document.body.addEventListener("click", (element) => {
  if (element.target.classList.contains("edit-card-btn")) {
    const cardElement = element.target.closest("div");
    showEditBookForm(cardElement);
  }
});

const alertBox = document.getElementById("alertBox");
const alertText = document.getElementById("alertText");
const closeAlert = document.getElementById("closeAlert");

function showAlertBox(text) {
  alertText.innerText = text;
  alertBox.style.right = "0";
  setTimeout(() => {
    hideAlertBox();
  }, 3000);
}

function hideAlertBox() {
  alertBox.style.right = "-100%";
}
closeAlert.addEventListener("click", hideAlertBox);

const searchBook = document.getElementById("searchBook");
function handleSearchBook() {
  const inputValue = searchBook.value.toLowerCase().trim();
  const filterBook = bookStorage.filter((book) => {
    const result = book.title.toLowerCase().trim().includes(inputValue);
    if (result) {
      return result;
    }
  });
  hideAllRootChild();
  filterBook.forEach((book) => {
    createCardElement(
      book.id,
      book.title,
      book.image,
      book.author,
      book.year,
      book.isBookmark
    );
  });
}

searchBook.addEventListener("input", handleSearchBook);

window.addEventListener("DOMContentLoaded", loadBookData);
