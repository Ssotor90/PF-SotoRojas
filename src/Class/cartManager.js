import fs from 'fs/promises';

class CartManager {
    constructor(path) {
    this.path = path;
    }

    async addCart(cart) {
    const carts = await this.getCarts();
    const newCart = {
        id: this.generateId(carts),
        ...cart
    };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
    }

    generateId(carts) {
    return carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    }

    async getCarts() {
    try {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
    }

    async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

}

export default CartManager;