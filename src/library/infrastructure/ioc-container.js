require("reflect-metadata");
const { Container, decorate, injectable } = require("inversify");
const { BookRepository } = require("../modules/BookRepository");

const container = new Container();

decorate(injectable(), BookRepository);
container.bind("BookRepository").to(BookRepository).inSingletonScope();

module.exports = { container };