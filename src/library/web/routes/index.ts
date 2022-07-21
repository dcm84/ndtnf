import { Request, Response } from "express";
import express from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.render("index", {
        title: "Главная страница",
    });
});

export default router;