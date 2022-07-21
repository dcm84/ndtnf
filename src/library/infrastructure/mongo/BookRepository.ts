import {BookModel} from "./BookModel";
import fs from 'fs';
import { BookInterface } from "../../interfaces/BookInterface";
import { BookInterfaceDTO } from "../../interfaces/BookInterfaceDTO";
import { injectable } from "inversify";
import BookRepositoryInterface from "../../interfaces/BookRepositoryInterface";

@injectable()
export default class BookRepository implements BookRepositoryInterface {
    constructor() {
        console.log("new BookService");
    }

    async createBook(data : BookInterfaceDTO) : Promise<BookInterface> {
        const book = new BookModel(data);
        await book.save();
        return book;
    }

    getBook(id : string) : Promise<BookInterface | null> {
        return BookModel.findById(id).select('-__v').exec();
    }

    getBooks() : Promise<BookInterface[]> {
        return BookModel.find().select('-__v').exec();
    }

    async updateBook(id : string, data : BookInterface) : Promise<BookInterface | null> {
        let book = await BookModel.findById(id);

        if (book == null) return null

        if (book.fileCover) {
            fs.unlink(book.fileCover, (err => {}));
        }
        if (book.fileBook) {
            fs.unlink(book.fileBook, (err => {}));
        }

        return await BookModel.findByIdAndUpdate(id, data)
    }

    async deleteBook(id : string) {
        let book = await BookModel.findById(id);

        if (book == null) return null

        if (book.fileCover) {
            fs.unlink(book.fileCover, (err => {}));
        }
        if (book.fileBook) {
            fs.unlink(book.fileBook, (err => {}));
        }

        return await BookModel.deleteOne({_id: id});
    }
}
