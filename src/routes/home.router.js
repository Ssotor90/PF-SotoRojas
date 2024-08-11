import { Router } from 'express';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Obtén el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

        res.render('products', {
        products: products.docs,
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
    });


export default router;
