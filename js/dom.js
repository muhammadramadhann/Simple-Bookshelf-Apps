const UNCOMPLETED_LIST_BOOK_ID = "incompleted_bookshelf";
const COMPLETED_LIST_BOOK_ID = "completed_bookshelf";
const BOOK_ITEMID = "item_id";

const makeBookDetail = (textTitle, textAuthor, textReleaseYear, isCompleted) => {
    const textBookTitle = document.createElement("h3");
    textBookTitle.innerText = textTitle;

    const textBookAuthor = document.createElement("p");
    textBookAuthor.classList.add("book_author");
    textBookAuthor.innerText = textAuthor;

    const textBookReleaseYear = document.createElement("p");
    textBookReleaseYear.classList.add("book_release_year");
    textBookReleaseYear.innerText = textReleaseYear;

    const bookDetailCover = document.createElement("div");
    bookDetailCover.classList.add("detail");
    bookDetailCover.append(textBookTitle, textBookAuthor, textBookReleaseYear);

    const bookActionCover = document.createElement("div");
    bookActionCover.classList.add("action");

    const articleCover = document.createElement("article");
    articleCover.append(bookDetailCover, bookActionCover);

    if (isCompleted) {
        bookActionCover.append(createUndoButton(), createDeleteButton());
    } else {
        bookActionCover.append(createChangeButton(), createDeleteButton());
    }

    return articleCover;
}

const createButton = (buttonType, buttonText, eventListener) => {
    const button = document.createElement("button");
    button.classList.add(buttonType);
    button.innerText = buttonText;
    button.addEventListener("click", (event) => {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

const createChangeButton = () => {
    return createButton("btn_change", "Done", (event) => {
        submitBookToCompleted(event.target.parentElement.parentElement);
    });
}

const createDeleteButton = () => {
    return createButton("btn_delete", "Delete", (event) => {
        const warning = confirm("Are you sure to delete this book?");
        if (warning) {
            removeBookFromCompleted(event.target.parentElement.parentElement);
        }
    });
}

const createUndoButton = () => {
    return createButton("btn_incompleted", "Unread", (event) => {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}

const submitBook = () => {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBOOKList = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const bookTitle = document.getElementById("title").value;
    const bookAuthor = document.getElementById("author").value;
    const bookReleaseYear = document.getElementById("release_year").value;
    const checkRead = document.getElementById("mark_read");

    if (checkRead.checked == true) {
        const bookshelf = makeBookDetail(bookTitle, bookAuthor, bookReleaseYear, true);
        const bookObject = composeBookObject(bookTitle, bookAuthor, bookReleaseYear, true);
        bookshelf[BOOK_ITEMID] = bookObject.id;
        books.push(bookObject);
        completedBOOKList.append(bookshelf);
    } else {
        const bookshelf = makeBookDetail(bookTitle, bookAuthor, bookReleaseYear, false);
        const bookObject = composeBookObject(bookTitle, bookAuthor, bookReleaseYear, false);
        bookshelf[BOOK_ITEMID] = bookObject.id;
        books.push(bookObject);
        uncompletedBOOKList.append(bookshelf);
    }

    updateDataToStorage();

    alert("The " + bookTitle + " book has ben successfully added!");

    clearBookForm();
}

const clearBookForm = () => {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("release_year").value = "";
    document.getElementById("mark_read").checked = false;
}

const submitBookToCompleted = (bookElement) => {
    const bookCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".detail > h3").innerText;
    const bookAuthor = bookElement.querySelector(".detail > p.book_author").innerText;
    const bookReleaseYear = bookElement.querySelector(".detail > p.book_release_year").innerText;

    const newBook = makeBookDetail(bookTitle, bookAuthor, bookReleaseYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;
    
    bookCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

const removeBookFromCompleted = (bookElement) => {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
    
    bookElement.remove();
    
    updateDataToStorage();
}

const undoBookFromCompleted = (bookElement) => {
    const bookUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".detail > h3").innerText;
    const bookAuthor = bookElement.querySelector(".detail > p.book_author").innerText;
    const bookReleaseYear = bookElement.querySelector(".detail > p.book_release_year").innerText;
    
    const newBook = makeBookDetail(bookTitle, bookAuthor, bookReleaseYear, false);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    bookUncompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

const filterBook = () => {
    const dataInput = document.getElementById("search_book_title").value;

    const incompleteBookshelf = document.getElementsByClassName("book_list")[0].getElementsByTagName("article");
    const completedBookshelf = document.getElementsByClassName("book_list")[1].getElementsByTagName("article");

    result(incompleteBookshelf, dataInput);
    result(completedBookshelf, dataInput);

    event.preventDefault();
}

const result = (section, dataInput) => {
    for (i = 0; i < section.length; i++) {
        const dataValue = section[i].textContent || section[i].innerText;
        if (dataValue.indexOf(dataInput) != -1) {
            section[i].style.display = "";
        } else {
            section[i].style.display = "none";
        }
    }
}