const BookModel = require("./BookModel");
const fs = require('fs');

class BookRepository {
    constructor() {
        console.log("new BookService");
    }

    getBooks() {
        return BookModel.find();
    }

    async createBook(data) {
        const book = new BookModel(data);
        await book.save();
        return book;
    }

    getBook(id) {
        return BookModel.findById(id).select('-__v');
    }

    getBooks() {
        return BookModel.find().select('-__v');
    }

    async updateBook(id, data) {
        let book = await BookModel.findById(id);

        if (book.fileCover) {
            fs.unlink(book.fileCover, (err => {}));
        }
        if (book.fileBook) {
            fs.unlink(book.fileBook, (err => {}));
        }

        return await BookModel.findByIdAndUpdate(id, data)
    }

    async deleteBook(id) {
        let book = await BookModel.findById(id);

        if (book.fileCover) {
            fs.unlink(book.fileCover, (err => {}));
        }
        if (book.fileBook) {
            fs.unlink(book.fileBook, (err => {}));
        }

        return await BookModel.deleteOne({_id: id});
    }
}

module.exports = {BookRepository}
