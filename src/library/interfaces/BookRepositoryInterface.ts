import { BookInterface } from "./BookInterface";
import { BookInterfaceDTO } from "./BookInterfaceDTO";

export default abstract class BookRepositoryInterface {
    abstract createBook(data : BookInterfaceDTO) : Promise<BookInterface> 
    abstract getBook(id : string) : Promise<BookInterface | null>
    abstract getBooks() : Promise<BookInterface[]>
    abstract updateBook(id : string, data : BookInterface) : Promise<BookInterface | null>
    abstract deleteBook(id : string) : any
}