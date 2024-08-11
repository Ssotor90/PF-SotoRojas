import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Cart from './models/Cart.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.engine('handlebars', engine({
    helpers: {
        calculateTotal: (products) => {
            return products.reduce((total, product) => total + product.totalPrice, 0);
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

let defaultCartId;
Cart.findOne().then(cart => {
  if (!cart) {
    Cart.create({ products: [] }).then(newCart => {
      defaultCartId = newCart._id.toString();
      console.log(`Carrito predeterminado creado con ID: ${defaultCartId}`);
    });
  } else {
    defaultCartId = cart._id.toString();
    console.log(`Usando el carrito predeterminado con ID: ${defaultCartId}`);
  }
});

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get('/', (req, res) => {
  res.redirect('/products');
});

app.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const filter = query ? { category: query } : {};
  const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

  try {
    const products = await Product.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption
    });

    const productsPlain = products.docs.map(product => product.toObject());

    res.render('products', {
      products: productsPlain,
      prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
      nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null,
      defaultCartId: defaultCartId 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/carts/:cid', async (req, res) => {
  try {
    console.log("Buscando carrito con ID:", req.params.cid);
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) {
      console.log("Carrito no encontrado");
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log("Carrito encontrado:", cart);
    const cartProductsPlain = cart.products.map(item => {
      return {
        title: item.product.title,
        description: item.product.description,
        price: item.product.price,
        quantity: item.quantity,
        totalPrice: item.quantity * item.product.price
      };
    });

    res.render('cart', {
      products: cartProductsPlain
    });
  } catch (error) {
    console.error("Error al buscar el carrito:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
