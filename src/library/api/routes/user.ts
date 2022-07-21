import { Request, Response } from "express";
import express from 'express';
const router = express.Router();

router.post('/login/', (req: Request, res: Response) => {
    res.status(201);
    res.json({ id: 1, mail: "test@mail.ru" });
});

export default router;