import { BookInterface } from "./BookInterface";

export interface BookInterfaceDTO {
    title: BookInterface['title'],
    description: BookInterface['description'],
    authors: BookInterface['authors'],
    favorite: BookInterface['favorite'],
    fileCover: BookInterface['fileCover'],
    fileBook: BookInterface['fileBook'],
}