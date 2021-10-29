const READ_STATUS = ["reading", "not-read", "read"];
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

/* ================================================== */

const statusMsg = document.getElementById("status-msg");

const coverCanvas = document.getElementById("preview-book-cover");
const coverColorInputs = document.querySelectorAll(".customize-cover input");
const coverThemes = document.getElementById("themes");
const customizeCoverBtn = document.getElementById("customize-cover-btn");
let currentBookTitle = "";
coverCanvas.width = 224; //192 + 32
coverCanvas.height = 336; //288 + 48

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
    console.log("Check pages read:");
    console.log(pagesInput);
    console.log(pagesReadInput);
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

    if(shouldCheckPagesReadInput) {
        let validPagesRead = checkPagesReadInput(pagesReadInput, pagesInput);
        if(validTitle && validAuthor && validPages && validPagesRead) {
            if(validFileAndNotUndefined) { //Create book
                console.log(titleInput);
                console.log(authorInput);
                console.log(pagesInput);
                console.log(pagesReadInput);
                console.log(fileInput);
                console.log("I create book");
                closeCurrentModal();
                encodeFileInputAndSetAsCoverImg(fileInput);
                console.log(imgCoverBase64);

            }
            else { //Push cover creation modal
                console.log(titleInput);
                console.log(authorInput);
                console.log(pagesInput);
                console.log(pagesReadInput);
                console.log("I push cover creation modal");
                closeCurrentModal();
                currentBookTitle = titleInput;
                let coverCreationModal = setCoverCreationModal();
                openModalAndSetCurrent(coverCreationModal);
            }
        }
    }
    else if(validTitle && validAuthor && validPages) {
        if(validFileAndNotUndefined) { // create book
            console.log(fileInput);
            console.log("I create book");
            closeCurrentModal();
            encodeFileInputAndSetAsCoverImg(fileInput);
            console.log(imgCoverBase64);
        }
        else { //Push cover creation modal
            console.log(titleInput);
            console.log(authorInput);
            console.log(pagesInput);
            console.log("I push cover creation modal");
            closeCurrentModal();
            currentBookTitle = titleInput;
            let coverCreationModal = setCoverCreationModal();
            openModalAndSetCurrent(coverCreationModal);
        }
    }
}

function encodeFileInputAndSetAsCoverImg(inputFile) {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(inputFile);
    fileReader.onload = function() {
        console.log(fileReader.result);
        //Set as new book card img src
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
    resetModalForm(currentModal);
    setTimeout(() => {        
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

function showPagesReadInput(e) {
    shouldCheckPagesReadInput = !shouldCheckPagesReadInput;
    pagesReadForm.classList.toggle("no-display");
}

function setCoverCreationModal() {
    let creationCoverModal = document.getElementById("cover-creation-modal");
    drawSimpleTheme(currentBookTitle);
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
        if(bookTitle.length >= 22) {
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
        if(bookTitle.length >= 22) {
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
        if(bookTitle.length >= 22) {
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
            drawVintageTheme(currentBookTitle, bgColor, decorationColor, textColor);
            break;
        case "modern":
            drawModernTheme(currentBookTitle, bgColor, decorationColor, textColor);
            break;
        default:
            drawSimpleTheme(currentBookTitle, bgColor, decorationColor, textColor);
    }
}

function saveCoverCanvas() {
    let coverCanvasBase64 = coverCanvas.toDataURL();
    console.log(coverCanvasBase64);
}

/* Animations */

function pushModalAnimation(mod) {
    mod.querySelector(".modal").style.transform = "scale(1)";
}

function popModalAnimation(mod) {
    mod.querySelector(".modal").style.transform = "scale(0.001)";
}

/* Events */

checkMark.addEventListener("change", showPagesReadInput)

statusMsg.addEventListener("click", changeStatus);

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

customizeCoverBtn.addEventListener("click", saveCoverCanvas);