const READ_STATUS = {"reading": "Reading", "not-read": "Not read yet..", "read": "Read"}; //Book possible status

/* Containers and add book float btn */

const booksContainer = document.getElementById("books-container");
const modalContainer = document.querySelector(".modal-container");
const addFloatBtn = document.getElementById("add-btn");
let currentModal = null;

/* Add book form */

const addBookForm = document.getElementById("add-book-form");
const bookTitle = document.getElementById("book-title");
const bookAuthor = document.getElementById("book-author");
const bookPages = document.getElementById("book-pages");
const pagesRead = document.getElementById("book-pages-read");
const checkMark = document.getElementById("checkmark");
const bookCover = document.getElementById("book-cover");
const pagesReadForm = document.getElementById("pages-read-form");
const closeModalIcons = document.querySelectorAll(".close-modal-icon");
let shouldCheckPagesReadInput = false;

/* Cover customization */

const coverCanvas = document.getElementById("preview-book-cover");
const coverColorInputs = document.querySelectorAll(".customize-cover input");
const coverThemes = document.getElementById("themes");
const customizeCoverBtn = document.getElementById("customize-cover-btn");
let currentBook = null;
coverCanvas.width = 224;
coverCanvas.height = 336;

let myLibrary = []; //Store books
let globalId = myLibrary.length;

class Book {
    
    constructor(cover, title, author, pagesRead, pages, status) {
        this.cover             = cover, 
        this.title             = title,
        this.author            = author,
        this.pagesRead         = pagesRead,
        this.pages             = pages,
        this.previousReadPages = pagesRead, //Useful when change status to change pagesRead/pages
        this.status            = status;
    }

    changeStatus(pagesRead, status) {
        this.pagesRead = pagesRead;
        this.status = status;
    }
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    pushBookAnimation(createBookCard(book, globalId, true));
    globalId++;
}

function removeBookFromLibrary(index) {
    myLibrary.splice(index, 1);
}

function displayLibrary(library) {
    for(let i = 0; i < library.length; i++) {
        createBookCard(library[i], i);
    }
}

displayLibrary(myLibrary);

function createBookCoverImg(book) {
    const bookImg = document.createElement("img");
    bookImg.src = book.cover;
    bookImg.alt = "book-cover";
    bookImg.classList.add("book-img")
    return bookImg;
}

function createBookValueProperty(book, index) {
    const bookPropertyContainer = document.createElement("div");
    const titleProp = document.createElement("span");
    const titleValue = document.createElement("span");
    const authorProp = document.createElement("span");
    const authorValue = document.createElement("span");
    const pagesProp = document.createElement("span");
    const pagesRead = document.createElement("span");
    const bookPages = document.createElement("span");
    const statusProp = document.createElement("span");
    const statusInfo = document.createElement("div");
    const statusValue = document.createElement("span");
    const iconReading = document.createElement("i");
    const iconNotRead = document.createElement("i");
    const iconRead = document.createElement("i");

    /* Title */
    titleProp.classList.add("prop");
    titleProp.textContent = "Title: ";
    titleValue.classList.add("book-value", "title");
    titleValue.textContent = `${book.title}`;
    titleProp.appendChild(titleValue);

    /* Author */
    authorProp.classList.add("prop");
    authorProp.textContent = "Author: ";
    authorValue.classList.add("book-value", "author");
    authorValue.textContent = `${book.author}`;
    authorProp.appendChild(authorValue);

    /* Pages read */
    pagesProp.classList.add("prop");
    pagesProp.textContent = "Pages: ";
    pagesRead.classList.add("book-value", "pages-read");
    pagesRead.textContent = `${book.pagesRead} `;
    pagesProp.appendChild(pagesRead);

    /* Book pages */
    bookPages.classList.add("book-value", "pages");
    bookPages.textContent = `/ ${book.pages}`;
    pagesProp.appendChild(bookPages);

    /* Status */
    statusProp.classList.add("prop");
    statusProp.textContent = "Status:";
    statusInfo.classList.add("status-info", `${book.status}`);
    statusInfo.onselectstart = function() {return false};
    statusValue.classList.add("status-msg");
    statusValue.textContent = `${READ_STATUS[book.status]} `;
    statusValue.setAttribute("bookIndex", index);
    statusValue.onclick = changeStatus; //Change book status event handler
    iconReading.classList.add("fas", "fa-book-reader");
    iconNotRead.classList.add("fas", "fa-book-open");
    iconRead.classList.add("fas", "fa-check-circle");
    statusInfo.appendChild(statusValue);
    statusInfo.appendChild(iconReading);
    statusInfo.appendChild(iconNotRead);
    statusInfo.appendChild(iconRead);

    /* Append all properties */
    bookPropertyContainer.classList.add("book-prop");
    bookPropertyContainer.appendChild(titleProp);
    bookPropertyContainer.appendChild(authorProp);
    bookPropertyContainer.appendChild(pagesProp);
    bookPropertyContainer.appendChild(statusProp);
    bookPropertyContainer.appendChild(statusInfo);

    return bookPropertyContainer;
}

function createBookButtons(index) {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons");
    const editButton = document.createElement("button");
    editButton.setAttribute("bookIndex", index);
    const penIcon = document.createElement("i");
    penIcon.setAttribute("bookIndex", index);
    penIcon.classList.add("fas", "fa-pen");
    const trashIcon = document.createElement("i");
    trashIcon.setAttribute("bookIndex", index);
    trashIcon.classList.add("fas", "fa-trash");
    editButton.classList.add("edit");
    editButton.type = "button";
    editButton.appendChild(penIcon);
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("bookIndex", index);
    deleteButton.classList.add("delete");
    deleteButton.type = "button";
    deleteButton.appendChild(trashIcon);
    
    /* Add event handlers */
    deleteButton.onclick = deleteCard;
    editButton.onclick = editCard;

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);
    return buttonsContainer;
}

function createBookCard(book, index, animation = false) {
    const bookCard = document.createElement("div");
    const cover = createBookCoverImg(book);
    const bookInfoContainer = document.createElement("div");
    const bookPropertyContainer = createBookValueProperty(book, index);
    const bookButtons = createBookButtons(index);
    bookCard.classList.add("book-card");
    if(animation) {
        bookCard.classList.add("pop");
    }
    bookCard.id = index;
    bookInfoContainer.classList.add("book-info");
    bookInfoContainer.appendChild(bookPropertyContainer);
    bookInfoContainer.appendChild(bookButtons);
    bookCard.appendChild(cover);
    bookCard.appendChild(bookInfoContainer);
    booksContainer.appendChild(bookCard);
    return bookCard;
}

function deleteCard(e) {
    let bookIndex = e.target.getAttribute("bookIndex");
    let bookCard = document.getElementById(bookIndex);
    removeBookFromLibrary(bookIndex);
    deleteBookAnimation(bookCard);
    bookCard.innerHTML = "";
}

function editCard(e) {

}

function updateCardReadPages(card, readPages) {
    let pagesReadSpan = card.querySelector(".book-value.pages-read");
    pagesReadSpan.textContent = `${readPages} `; 
}

function changeStatus(e) { // TODO: change this function
    const parent = e.target.parentElement;
    let bookIndex = e.target.getAttribute("bookIndex");
    let bookToChange = myLibrary[bookIndex];
    let bookStatus = bookToChange.status;
    switch(bookStatus) {
        case "reading":
            parent.className = "status-info not-read";
            e.target.textContent = READ_STATUS["not-read"];
            bookToChange.changeStatus(0, "not-read");
            break;
        case "not-read":
            parent.className = "status-info read";
            e.target.textContent = READ_STATUS["read"];
            bookToChange.changeStatus(bookToChange.pages, "read");
            break;
        default:
            parent.className = "status-info reading";
            e.target.textContent = READ_STATUS["reading"];
            bookToChange.changeStatus(bookToChange.previousReadPages, "reading");
    }
    const cardToChange = document.getElementById(bookIndex);
    updateCardReadPages(cardToChange, bookToChange.pagesRead);
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

function checkTitleInput(titleInput) {
    if(titleInput === "") {
        showErrorFor(bookTitle, "Please insert a book title");
        return false;
    }
    else {
        showSuccessFor(bookTitle);
        return true;
    }
}

function checkAuthorInput(authorInput) {
    if(authorInput === "") {
        showErrorFor(bookAuthor, "Please insert an Author for your book");
        return false;
    }
    else {
        showSuccessFor(bookAuthor);
        return true;
    }
}

function checkPagesInput(pagesInput) {
    if(pagesInput === "") {
        showErrorFor(bookPages, "Please insert the total pages of your book");
    }
    else if(pagesInput < 0) {
        showErrorFor(bookPages, "Please insert positive number for book pages");
    }
    else if(pagesInput === 0 || pagesInput > 99999) {
        showErrorFor(bookPages, "Please select a number between 1 and 99999");
    }
    else {
        showSuccessFor(bookPages);
        return true;
    }
    return false;
}

function checkPagesReadInput(pagesReadInput, pagesInput) {
    if(pagesReadInput === "") {
        showErrorFor(pagesRead, "Please insert the total pages you read")
    }
    else if(pagesInput !== "") {
        if(pagesReadInput === 0) {
           showErrorFor(pagesRead, "Please insert a number of pages read greater than 0"); 
        }
        else if(pagesReadInput < 1 || pagesReadInput > pagesInput) {
           showErrorFor(pagesRead, `Please insert a number of pages read between 1 and ${pagesInput}`); 
        }
        else {
            showSuccessFor(pagesRead);
            return true;
        }
    }
    return false;
}

function checkFileInput(fileInput) {
    if(fileInput !== undefined) {
        console.log(fileInput.size);
        if(fileInput.size > 3072*Math.pow(10,3)) {
            showErrorFor(bookCover, "File size must be less than 3Mb");
            return false;
        }
        else {
            showSuccessFor(bookCover);
            return true;
        }
    }
    return false;
}

function checkForm() {
    const titleInput = bookTitle.value;
    const authorInput = bookAuthor.value;
    const pagesInput = +bookPages.value;
    const pagesReadInput = +pagesRead.value;
    const fileInput = bookCover.files[0];
    let validTitle = checkTitleInput(titleInput);
    let validFileAndNotUndefined = checkFileInput(fileInput);
    let validAuthor = checkAuthorInput(authorInput);
    let validPages = checkPagesInput(pagesInput);
    let status = "not-read";
    let validForm = false;

    if(shouldCheckPagesReadInput) {
        let validPagesRead = checkPagesReadInput(pagesReadInput, pagesInput);
        if(validTitle && validAuthor && validPages && validPagesRead) {
            validForm = true;
            status = "reading";
            if(pagesInput === pagesReadInput) {
                status = "read";
            }
        }
    }
    else if(validTitle && validAuthor && validPages) {
        validForm = true;
    }
    if(validForm) {
        currentBook = new Book("", titleInput, authorInput, pagesReadInput, pagesInput, status);
        if(validFileAndNotUndefined) { //Create book
            setCoverInputAndCreateBookCard(fileInput, currentBook);
        }
        else if(fileInput === undefined){ //Push cover creation modal if cover is not provided
            closeCurrentModal();
            let coverCreationModal = setCoverCreationModal();
            openModalAndSetCurrent(coverCreationModal);
        }
    }
}

function setCoverInputAndCreateBookCard(inputFile, userBook) {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(inputFile);
    fileReader.onload = function() {
        closeCurrentModal();
        userBook.cover = fileReader.result;
        addBookToLibrary(userBook);
    }
    fileReader.onerror = function() {
        alert(fileReader.error);
    }
}

function resetModalForm(modal) {
    let form = modal.querySelector("form");
    if(form !== null) {
        if(form.id === "add-book-form") {
            shouldCheckPagesReadInput = false;
            let inputs = form.querySelectorAll(".form-control");
            inputs.forEach(input => {
                if(input.id === "pages-read-form") {
                    input.classList.add("no-display");
                }
                input.classList.remove("error", "success");
            });
        }
        form.reset();
    }
}

function closeCurrentModal() {
    popModalAnimation(currentModal);
    setTimeout(() => {        
        resetModalForm(currentModal);
        currentModal.style.display = "none";
        currentModal = null;
    }, 300);
}

function openModalAndSetCurrent(mod) {
    mod.style.display = "flex";
    setTimeout(() => {        
        currentModal = mod;
        pushModalAnimation(mod);
    }, 300);
}

function isClickOutsideModal(e) {
    if(e.target.classList.contains("modal-container")) {
        closeCurrentModal();
    }
}

function escapeCurrentModal(e) {
    if(e.key === "Escape" && currentModal !== null) {
        closeCurrentModal()
    }
}

function showPagesReadInput() {
    shouldCheckPagesReadInput = !shouldCheckPagesReadInput;
    pagesReadForm.classList.toggle("no-display");
}

function setCoverCreationModal() {
    let creationCoverModal = document.getElementById("cover-creation-modal");
    drawSimpleTheme(currentBook.title);
    return creationCoverModal;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(" ");
    console.table(words);
    let line = "";
    for(let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let testWidth = context.measureText(testLine).width;
        console.log(testWidth);
        console.log(maxWidth);
        if(testWidth > maxWidth && i > 0) {
            context.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function drawSimpleTheme(bookTitle = "Title", bgColor = "rgb(255, 255, 255)", decorationColor = "rgb(0, 0, 0)", 
    textColor = "rgb(255, 255, 255)") {
    if(coverCanvas.getContext) {
        let ctx = coverCanvas.getContext("2d");
        ctx.clearRect(0, 0, 224, 336);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 224, 336);
        ctx.fillStyle = decorationColor;
        ctx.fillRect(0, 128, 224, 80);
        ctx.fillStyle = textColor;
        ctx.font = "18px serif";
        ctx.textAlign = "center";
        if(bookTitle.length >= 24) {
            wrapText(ctx, bookTitle, 112, 158, 215, 20);
        }
        else {
            ctx.fillText(bookTitle, 112, 178, 215);
        }
    }

}

function drawModernTheme(bookTitle = "Title", bgColor = "rgb(255, 255, 255)", decorationColor = "rgb(0, 0, 0)", 
    textColor = "rgb(255, 255, 255)") {
    if(coverCanvas.getContext) {
        let ctx = coverCanvas.getContext("2d");
        ctx.clearRect(0, 0, 224, 336);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 224, 336);
        ctx.fillStyle = decorationColor;
        ctx.beginPath();
        ctx.arc(0, 0, 70, 0, 1.5*Math.PI);
        ctx.moveTo(192, 0);
        ctx.arc(224, 0, 70, 0, 1.5*Math.PI);
        ctx.moveTo(0, 366);
        ctx.arc(0, 336, 70, 1.5*Math.PI, 0.5*Math.PI);
        ctx.moveTo(224, 336);
        ctx.arc(224, 336, 70, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = textColor;
        ctx.font = "18px serif";
        ctx.textAlign = "center";
        if(bookTitle.length >= 24) {
            wrapText(ctx, bookTitle, 112, 158, 215, 20);
        }
        else {
            ctx.fillText(bookTitle, 112, 178, 215);
        }
    }
}

function drawVintageTheme(bookTitle = "Title", bgColor = "rgb(255, 255, 255)", decorationColor = "rgb(0, 0, 0)", 
    textColor = "rgb(255, 255, 255)") {
    if(coverCanvas.getContext) {
        let ctx = coverCanvas.getContext("2d");
        ctx.clearRect(0, 0, 224, 336);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 224, 336);
        ctx.fillStyle = decorationColor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(70, 0);
        ctx.lineTo(0, 70);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, 336);
        ctx.lineTo(70, 336);
        ctx.lineTo(0, 266);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(224, 336);
        ctx.lineTo(154, 336);
        ctx.lineTo(224, 266);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(224, 0);
        ctx.lineTo(154, 0);
        ctx.lineTo(224, 70);
        ctx.fill();
        ctx.fillStyle = textColor;
        ctx.font = "18px serif";
        ctx.textAlign = "center";
        if(bookTitle.length >= 24) {
            wrapText(ctx, bookTitle, 112, 158, 215, 20);
        }
        else {
            ctx.fillText(bookTitle, 112, 178, 215);
        }
    }

}

function getThemeAndDraw() {
    let bgColor = document.getElementById("bg-cover-color").value
    let textColor = document.getElementById("text-cover-color").value
    let decorationColor = document.getElementById("decoration-cover-color").value
    let theme = coverThemes.value;
    switch(theme) {
        case "vintage":
            drawVintageTheme(currentBook.title, bgColor, decorationColor, textColor);
            break;
        case "modern":
            drawModernTheme(currentBook.title, bgColor, decorationColor, textColor);
            break;
        default:
            drawSimpleTheme(currentBook.title, bgColor, decorationColor, textColor);
    }
}

function saveCoverCanvasAndCreateBookCard() {
    let cover = coverCanvas.toDataURL();
    currentBook.cover = cover;
    addBookToLibrary(currentBook);
    closeCurrentModal();
}

/* Animations */

function pushModalAnimation(mod) {
    mod.querySelector(".modal").style.transform = "scale(1)";
}

function popModalAnimation(mod) {
    mod.querySelector(".modal").style.transform = "scale(0.001)";
}

function pushBookAnimation(bookCard) {
    setTimeout(() => {
        bookCard.classList.remove("pop");
    }, 300);
}

function deleteBookAnimation(bookCard) {
    bookCard.classList.add("book-card", "pop");
    setTimeout(() => {
        bookCard.style.display = "none";
    }, 300);
}

/* Events */

checkMark.addEventListener("change", showPagesReadInput)

addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    checkForm();
});

closeModalIcons.forEach(closeIcons => {
    closeIcons.addEventListener("click", closeCurrentModal);
});

addFloatBtn.addEventListener("click", () => {
    modalContainer.style.display = "flex";
    setTimeout(pushModalAnimation, 100, modalContainer);
    currentModal = modalContainer;
});

window.addEventListener("click", isClickOutsideModal)

document.addEventListener("keydown", escapeCurrentModal);

coverColorInputs.forEach(colorInput => {
    colorInput.addEventListener("change", getThemeAndDraw);
});

coverThemes.addEventListener("change", getThemeAndDraw);

customizeCoverBtn.addEventListener("click", saveCoverCanvasAndCreateBookCard);