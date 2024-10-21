import express from 'express';
import Ticket from '../models/Ticket.js';
import CartRepository from '../repositories/CartRepository.js';

const router = express.Router();

router.post('/:cid/purchase', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await CartRepository.getCartById(cartId);

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const productsWithStock = cart.products.filter(product => product.stock >= product.quantity);
    const productsOutOfStock = cart.products.filter(product => product.stock < product.quantity);

    if (productsOutOfStock.length > 0) {
        return res.status(400).json({ message: 'Some products are out of stock', productsOutOfStock });
    }

    productsWithStock.forEach(async product => {
        product.stock -= product.quantity;
        await product.save();
    });

    const ticket = new Ticket({
        amount: cart.totalAmount,
        purchaser: req.user.email,
    });

    await ticket.save();

    res.json({ message: 'Purchase completed successfully', ticket });
});

export default router;
