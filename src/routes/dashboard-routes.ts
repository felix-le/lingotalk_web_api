import express, { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/middleware';

const router = require('express').Router()

router.get('/dashboard', authMiddleware.verifyToken, (req: Request, res: Response) => {
    return res.json({ status: true, message: "Hello from dashboard." });
});

export default router;