import express from 'express';
import Product from '../models/Product.js'; // Asegúrate de importar el modelo aquí

const router = express.Router();

// Obtener productos con filtros, paginación, ordenamiento y búsqueda
router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  // Filtro por categoría
  const filter = query ? { category: { $regex: query, $options: 'i' } } : {};
  const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

  try {
    const products = await Product.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption
    });

    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;