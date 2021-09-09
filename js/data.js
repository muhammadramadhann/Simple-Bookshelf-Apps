const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];

const checkForStorage = () => {
    if (typeof(Storage) === "undefined") {
        alert("Browser Anda Tidak Mendukung Web Storage");
        return false;
    }
    return true;
}

const saveData = () => {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

const loadDataFromStorage = () => {
    const serialData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serialData);

    if (data !== null) 
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

const updateDataToStorage = () => {
    if (checkForStorage()) 
        saveData();
}

const composeBookObject = (title, author, year, isCompleted) => {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
}

const findBook = (bookId) => {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

const findBookIndex = (bookId) => {
    let index = 0;
    for (book of books) {
        if (book.id === bookId)
            return index;
        
        index++;
    }
    return -1;
}

const refreshDataFromBooks = () => {
    const bookUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let bookCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for (book of books) {
        const newBook = makeBookDetail(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if (book.isCompleted) {
            bookCompleted.append(newBook);
        } else {
            bookUncompleted.append(newBook);
        }
    }
}