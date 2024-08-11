import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });

    const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);
    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity = parseInt(quantity);
    } else {
      cart.products.push({ product: pid, quantity: parseInt(quantity) });
    }

    await cart.save();
    res.json({ status: 'success', message: 'Product added or updated in cart', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  console.log(`Actualizando carrito ${cid}, producto ${pid} con cantidad ${quantity}`);

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
    if (productIndex === -1) return res.status(404).json({ status: 'error', message: 'Product not found in cart' });

    cart.products[productIndex].quantity = parseInt(quantity);
    console.log(`Cantidad actualizada en el producto: ${cart.products[productIndex].quantity}`);

    await cart.save();
    console.log('Carrito actualizado correctamente en la base de datos');

    const updatedProduct = cart.products[productIndex];
    const productDetails = await Product.findById(pid);
    updatedProduct.totalPrice = updatedProduct.quantity * productDetails.price;

    const cartTotal = cart.products.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);

    res.json({ status: 'success', updatedProduct, cartTotal });
  } catch (error) {
    console.error('Error al actualizar la cantidad en el carrito:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const cartProducts = cart.products.map(item => ({
      id: item.product._id.toString(),
      title: item.product.title,
      description: item.product.description,
      price: item.product.price,
      quantity: item.quantity,
      totalPrice: item.quantity * item.product.price
    }));

    res.json({
      cartId: cart._id.toString(),
      products: cartProducts
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
    if (productIndex === -1) return res.status(404).json({ status: 'error', message: 'Product not found in cart' });

    cart.products.splice(productIndex, 1);

    await cart.save();
    res.json({ status: 'success', message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error en la ruta DELETE /:cid/products/:pid:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
