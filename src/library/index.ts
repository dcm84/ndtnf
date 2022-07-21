import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from "body-parser";

//стартуем БД
require("./infrastructure/mongo/db_connection");

//middleware с обработкой ошибок
import error404Middleware from './middleware/error404';
import error500Middleware from './middleware/error500';

//routes
import indexRouter from './web/routes/index';
import booksRouter from './web/routes/books';
import apiUserRouter from './api/routes/user';
import apiBooksRouter from './api/routes/books';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());

//настраиваем ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'web/views'));  //для того, чтобы обеспечить запуск не из корня проекта

//статический маршрут
app.use('/public', express.static(__dirname + "/public"));

//маршруты ejs
app.use('/', indexRouter);
app.use('/books', booksRouter);

//маршруты api
app.use('/api/user', apiUserRouter);
app.use('/api/books', apiBooksRouter);

//обработчики ошибок
app.use(error404Middleware);
app.use(error500Middleware);

//стартуем сервер
const PORT = process.env.LIBRARY_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
})
