import UserDAO from '../daos/UserDao.js';

class UserRepository {
    async getUserById(id) {
        return await UserDAO.findById(id);
    }

    async createUser(userData) {
        return await UserDAO.create(userData);
    }

    async updateUser(id, userData) {
        return await UserDAO.update(id, userData);
    }

    async deleteUser(id) {
        return await UserDAO.delete(id);
    }
}

export default new UserRepository();
