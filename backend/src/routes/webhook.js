import express from 'express';
import { User } from '../models/user.model.js';

const router = express.Router();

router.post('/clerk-webhook', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'user.deleted') {
        const { id } = data;

        try {
            await User.findOneAndDelete({ clerkId: id });
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(400).json({ error: 'Invalid event type' });
    }
});

export default router;
