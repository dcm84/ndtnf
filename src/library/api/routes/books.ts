import express, { Request, Response } from 'express';
const router = express.Router();
import fileMiddleware from '../../middleware/file';
import { container } from "../../infrastructure/ioc-container";
import bookRepositoryInterface from '../../interfaces/BookRepositoryInterface'

router.get('/', async (req : Request, res: Response) => {
    const bookRepo = container.get(bookRepositoryInterface);
    const books = await bookRepo.getBooks()
    res.json(books);
});

router.post('/', fileMiddleware.fields([
    { name: 'cover-img', maxCount: 1 },
    { name: 'book-file', maxCount: 1 }
]), async (req : Request, res: Response) => {
    const { title, desc, authors, favorite } = req.body;

    if (req.files != undefined && 'cover-img' in req.files && 'book-file' in req.files && title.trim() != "") {

        try {
            const bookRepo = container.get(bookRepositoryInterface);
            let newBook = await bookRepo.createBook({
                title, 
                description: desc, authors, favorite,
                fileCover: req.files['cover-img'][0]['path'].replaceAll(/[\\]+/g, '/'),
                fileBook: req.files['book-file'][0]['path'].replaceAll(/[\\]+/g, '/')
            });

            res.json(newBook);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                errrorCode: 500,
                errorMessage: "Ошибка сохранения данных"
            });
        }
    
    } else {
        res.status(500).json({
            errrorCode: 500,
            errorMessage: "Обязательно загрузите хотя бы обложку, файл книги и ее название"
        });
    }
});

router.get('/:id', async (req : Request, res: Response) => {
    const {id} = req.params;

    try {
        const bookRepo = container.get(bookRepositoryInterface);
        const book = await bookRepo.getBook(id);
        res.json(book);
    } catch (e) {
        console.error(e);
        res.status(404).json({
            errrorCode: 404,
            errorMessage: "Книга не найдена"
        });
    }
});

router.put('/:id', fileMiddleware.fields([
    { name: 'cover-img', maxCount: 1 },
    { name: 'book-file', maxCount: 1 }
]), async (req : Request, res: Response) => {
    const { title, desc, authors, favorite } = req.body;
    const { id } = req.params;

    //если загружены новые файлы 
    if (req.files != undefined && 'cover-img' in req.files && 'book-file' in req.files && title.trim() != "") {
        try {
            const bookRepo = container.get(bookRepositoryInterface);
            await bookRepo.updateBook(id, {
                title, 
                description: desc, authors, favorite,
                fileCover: req.files['cover-img'][0]['path'].replaceAll(/[\\]+/g, '/'),
                fileBook: req.files['book-file'][0]['path'].replaceAll(/[\\]+/g, '/')
            });

            res.redirect(`/api/books/${id}`);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                errrorCode: 500,
                errorMessage: "Ошибка обновления данных"
            });
        }

    } else {
        res.status(500).json({
            errrorCode: 500,
            errorMessage: "Обязательно загрузите хотя бы обложку, файл книги и ее название"
        });
    }
});

router.delete('/:id', async (req : Request, res: Response) => {
    const { id } = req.params;
    
    //проверяем, что такой объект еще есть, нужно удалить файлы в фс
    try {
        const bookRepo = container.get(bookRepositoryInterface);
        await bookRepo.deleteBook(id);
        res.json('ok');
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: "Ошибка удаления данных"
        });
    }
});

router.get('/:id/download', async (req : Request, res: Response) => {
    const { id } = req.params;
    try {
        const bookRepo = container.get(bookRepositoryInterface);
        let book = await bookRepo.getBook(id);
        
        if(book != null && book.fileBook) {
            res.download(__dirname + '/../' + book.fileBook, book.title + book.fileBook.replace(/.*(\.[a-z0-9]+)$/, "$1"), err => {});
        }
        else {
            res.status(404).json({
                errrorCode: 404,
                errorMessage: "Файл книги отсутствует"
            });
        }
    } catch (e) {
        console.error(e);
        res.status(404).json({
            errrorCode: 404,
            errorMessage: "Книга не найдена"
        });
    }
});

export default router;