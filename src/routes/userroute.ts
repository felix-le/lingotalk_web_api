import { Router, Request, Response } from 'express';
import verifyToken from '../middleware/middleware';

const router = Router();

router.get('/dashboard', verifyToken, (req: Request, res: Response) => {
    return res.json({ status: true, message: "Hello from dashboard." });
});

export default router;