interface Book {
    title: string;
    author: string;
    pages: number;
    isAvailable: boolean;
}

function printBookInfo(book: Book): void {
    console.log(`Title: ${book.title}`);
    console.log(`Author: ${book.author}`);
    console.log(`Pages: ${book.pages}`);
    console.log(`Available: ${book.isAvailable}`);
}

const book1: Book = {
    title: "Code with Tanmay",
    author: "Tanmay",
    pages: 464,
    isAvailable: true,
};

const book2: Book = {
    title: "You Don't Know TS Yet",
    author: "Tanmay",
    pages: 302,
    isAvailable: false,
};

printBookInfo(book1);
printBookInfo(book2);


