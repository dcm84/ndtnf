import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    res.status(404);
    res.render("errors/404", {
        title: "404 | страница не найдена",
    });
};