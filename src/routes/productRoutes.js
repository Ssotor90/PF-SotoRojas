import { isAdmin, isUser } from '../middlewares/authMiddleware.js';

router.post('/create', isAdmin, (req, res) => {
});

router.post('/add-to-cart', isUser, (req, res) => {
});
