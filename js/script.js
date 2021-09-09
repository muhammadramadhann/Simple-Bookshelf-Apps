document.addEventListener("DOMContentLoaded", () => {
    
    const inputBook = document.getElementById("input_book");

    inputBook.addEventListener("submit", () => {
        event.preventDefault();

        submitBook();
    });

    if (checkForStorage()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});