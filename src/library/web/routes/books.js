const fs = require('fs');
const express = require('express');
const router = express.Router();
const fileMiddleware = require('../../middleware/file');
const { container } = require("../../infrastructure/ioc-container");

router.get('/', async (req, res) => {
    const bookRepository = container.get("BookRepository");
    const books = await bookRepository.getBooks()
    res.render("books/index", {
        title: "Library",
        books
    });
});

router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Добавление книги",
        book: {},
    });
});

router.post('/create', fileMiddleware.fields([
    { name: 'cover-img', maxCount: 1 },
    { name: 'book-file', maxCount: 1 }
]), async (req, res) => {

    const { title, desc, authors, favorite } = req.body;

    if ('cover-img' in req.files && 'book-file' in req.files && title.trim() != "") {

        try {
            const bookRepository = container.get("BookRepository");
            await bookRepository.createBook({
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

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let book

    try {
        const bookRepository = container.get("BookRepository");
        book = await bookRepository.getBook(id);
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.render("books/view", {
        title: "Просмотр информации о книге",
        book
    });
});

router.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    let book

    try {
        const bookRepository = container.get("BookRepository");
        book = await bookRepository.getBook(id);
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
]), async (req, res) => {

    const { title, desc, authors, favorite } = req.body;
    const { id } = req.params;

    //если загружены новые файлы 
    if ('cover-img' in req.files && 'book-file' in req.files && title.trim() != "") {
        try {
            const bookRepository = container.get("BookRepository");
            await bookRepository.updateBook(id, {
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

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const bookRepository = container.get("BookRepository");
        await bookRepository.deleteBook(id);
        res.redirect('/books');

    } catch (e) {
        console.error(e);
        res.status(500).render("errors/500", {
            error: "Ошибка удаления данных"
        });
    }
});

router.get('/:id/download', async (req, res) => {
    const { id } = req.params;
    try {
        const bookRepository = container.get("BookRepository");
        let book = await bookRepository.getBook(id);
        
        if(book.fileBook) {
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

module.exports = router;