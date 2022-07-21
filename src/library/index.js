const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");

//стартуем БД
require("./infrastructure/mongo/db_connection");

//middleware с обработкой ошибок
const error404Middleware = require('./middleware/error404');
const error500Middleware = require('./middleware/error500');

//routes
const indexRouter = require('./web/routes/index');
const booksRouter = require('./web/routes/books');
const apiUserRouter = require('./api/routes/user');
const apiBooksRouter = require('./api/routes/books');

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
