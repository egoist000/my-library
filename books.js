const READ_STATUS = ["reading", "not-read", "read"];
const modal = document.querySelector(".modal-container");
const addFloatBtn = document.getElementById("add-btn");
let currentModal = null;

/* Add book form */
const addBookForm = document.getElementById("add-book-form");
const bookTitle = document.getElementById("book-title");
const bookAuthor = document.getElementById("book-author");
const bookPages = document.getElementById("book-pages");

const statusMsg = document.getElementById("status-msg")

let myLibrary = [];

function Book(title, author, numberOfPages, isRead) {
    this.title = title,
    this.author = author,
    this.numberOfPages = numberOfPages,
    this.isRead = isRead
}

Book.prototype.info = function() {
    let str = `${this.title} by ${this.author}, ${this.numberOfPages} pages, `;
    return this.isRead ? str + "read." : str + "not read yet.";
}

function addBookToLibrary() {

}

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 256, true);

function changeStatus(e) {
    const parent = e.target.parentElement;
    let index = READ_STATUS.indexOf(parent.classList.item(1)); //reading, read or not-read class
    switch(index) {
        case 0:
            parent.className = "status-info not-read";
            e.target.textContent = "Not read yet..";
            //TODO: change read pages if user input not-read ex: 234/500 => 0/500
            break;
        case 1:
            parent.className = "status-info read";
            e.target.textContent = "Read"
            //TODO: change read pages if user input Read ex: 234/500 => 500/500
            break;
        default:
            parent.className = "status-info reading";
            e.target.textContent = "Reading";
            //TODO: restore previous pages if user input reading
    }
}

function showErrorFor(input, errorMsg) {
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");
    small.textContent = errorMsg;
    formControl.className = "form-control error";
}

function showSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success"
}

function checkForm() {
    const titleInput = bookTitle.value;
    const authorInput = bookAuthor.value;
    const pagesInput = bookPages.value;
    let validTitle = false;
    let validAuthor = false;
    let validPages = false;

    if(titleInput === "") {
        showErrorFor(bookTitle, "Please insert a book title");
    }
    else {
        showSuccessFor(bookTitle);
        validTitle = true;
    }

    if(authorInput === "") {
        showErrorFor(bookAuthor, "Please insert an Author for your book");
    }
    else {
        showSuccessFor(bookAuthor);
        validAuthor = true;
    }

    if(pagesInput === "") {
        showErrorFor(bookPages, "Please insert the total pages of your book");
    }
    else if(pagesInput < 0) {
        showErrorFor(bookPages, "Please insert positive number for book pages");
    }
    else if(pagesInput == 0 || pagesInput > 99999) {
        showErrorFor(bookPages, "Please select a number between 1 and 99999");
    }
    else {
        showSuccessFor(bookPages);
        validPages = true;
    }

    if(validTitle && validAuthor && validPages) {
        console.log(titleInput);
        console.log(authorInput);
        console.log(pagesInput);
    }
}

function isEscapePressed(e) {
    if(e.key === "Escape" && currentModal !== null) {
        currentModal.style.display = "none";
    }
}

statusMsg.addEventListener("click", changeStatus);

addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    checkForm();
});

addFloatBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    currentModal = modal;
});

window.addEventListener("click", (e) => {
    if(e.target === modal) {
        modal.style.display = "none";
        currentModal = null;
    }
});

document.addEventListener("keydown", isEscapePressed);
