import fs from 'fs/promises';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        const products = await this.getProducts();
        
        if (!this.validateProduct(product)) {
            throw new Error('Producto inválido');
        }

        if (product.id) {
            const index = products.findIndex(p => p.id === product.id);
            if (index !== -1) {
                products[index] = { ...products[index], ...product };
            } else {
                product.id = this.generateId(products);
                products.push(product);
            }
        } else {
            product.id = this.generateId(products);
            products.push(product);
        }

        await this.saveProducts(products);
        return product;
    }

    validateProduct(product) {
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        return requiredFields.every(field => product[field] != null);
    }

    generateId(products) {
        return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveProducts(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
    
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
    
        const updatedProduct = { ...products[index], ...updates };
    
        products[index] = updatedProduct;
    
        await this.saveProducts(products);
        return updatedProduct;
    }
    
    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        const deletedProduct = products.splice(index, 1);
        await this.saveProducts(products);
        return deletedProduct[0];
    }
}

export default ProductManager;
