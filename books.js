function Book(title, author, numberOfPages, isRead) {
    this.title = title,
    this.author = author,
    this.numberOfPages = numberOfPages,
    this.isRead = isRead
}

Book.prototype.info = function() {
    let str = `${this.title} by ${this.author}, ${this.numberOfPages} pages, `;
    return isRead ? str + "read." : str + "not read yet.";
}

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 256, true);

console.log(theHobbit.info());

