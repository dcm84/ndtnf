import { Schema, model} from 'mongoose';
import { BookInterface } from '../../interfaces/BookInterface';

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    authors: {
        type: String,
        default: "",
    },
    favorite: {
        type: String,
        default: "",
    },
    fileCover: {
        type: String,
        default: "",
    },
    fileBook: {
        type: String,
        default: "",
    }
});

export const BookModel = model<BookInterface & Document>('Book', bookSchema);