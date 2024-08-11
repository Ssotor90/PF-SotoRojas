import { Router } from 'express';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Obtén el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/', (req, res) => {
    const products = JSON.parse(fs.readFileSync(join(__dirname, '../data/products.json'), 'utf-8'));
    res.render('realTimeProducts', { products });
});

export default router;
