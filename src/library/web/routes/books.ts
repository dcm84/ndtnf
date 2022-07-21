import express, { Request, Response } from 'express';
const router = express.Router();
import fileMiddleware from '../../middleware/file';
import { container } from "../../infrastructure/ioc-container";
import bookRepositoryInterface from '../../interfaces/BookRepositoryInterface'

router.get('/', async (req : Request, res: Response) => {
    const bookRepo = container.get(bookRepositoryInterface);
    const books = await bookRepo.getBooks()
    res.render("books/index", {
        title: "Library",
        books
    });
});

router.get('/create', (req : Request, res: Response) => {
    res.render("books/create", {
        title: "Добавление книги",
        book: {},
    });
});

router.post('/create', fileMiddleware.fields([
    { name: 'cover-img', maxCount: 1 },
    { name: 'book-file', maxCount: 1 }
]), async (req : Request, res: Response) => {

    const { title, desc, authors, favorite } = req.body;

    if (req.files != undefined && 'cover-img' in req.files && 'book-file' in req.files && title.trim() != "") {

        try {
            const bookRepo = container.get(bookRepositoryInterface);
            await bookRepo.createBook({
                title, 
                description: desc, authors, favorite,
                fileCover: req.files['cover-img'][0]['path'].replaceAll(/[\\]+/g, '/'),
                fileBook: req.files['book-file'][0]['path'].replaceAll(/[\\]+/g, '/')
            });
            res.redirect('/books');
        } catch (e) {
            console.error(e);
            res.status(500).render("errors/500", {
                error: "Ошибка сохранения данных"
            });
        }
    
    } else {
        res.status(500).render("errors/500", {
            error: "Обязательно загрузите хотя бы обложку, файл книги и ее название"
        });
    }
});

router.get('/:id', async (req : Request, res: Response) => {
    const { id } = req.params;
    let book

    try {
        const bookRepo = container.get(bookRepositoryInterface);
        book = await bookRepo.getBook(id);
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.render("books/view", {
        title: "Просмотр информации о книге",
        book
    });
});

router.get('/update/:id', async (req : Request, res: Response) => {
    const { id } = req.params;
    let book

    try {
        const bookRepo = container.get(bookRepositoryInterface);
        book = await bookRepo.getBook(id);
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.render("books/update", {
        title: "Редактирование книги",
        book
    });
});

router.post('/update/:id', fileMiddleware.fields([
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

            res.redirect(`/books/${id}`);
        } catch (e) {
            console.error(e);
            res.status(500).render("errors/500", {
                error: "Ошибка сохранения данных"
            });
        }

    } else {
        res.status(500).render("errors/500", {
            error: "Обязательно загрузите хотя бы обложку, файл книги и ее название"
        });
    }
});

router.post('/delete/:id', async (req : Request, res: Response) => {
    const { id } = req.params;

    try {
        const bookRepo = container.get(bookRepositoryInterface);
        await bookRepo.deleteBook(id);
        res.redirect('/books');

    } catch (e) {
        console.error(e);
        res.status(500).render("errors/500", {
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
            res.status(404).redirect('/404');
        }
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

});

export default router;