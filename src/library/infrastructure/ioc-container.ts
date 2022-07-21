require("reflect-metadata");
import { Container} from "inversify";
import BookRepository from "./mongo/BookRepository";
import BookRepositoryInterface from "../interfaces/BookRepositoryInterface";

export const container = new Container();
container.bind(BookRepositoryInterface).to(BookRepository).inSingletonScope();