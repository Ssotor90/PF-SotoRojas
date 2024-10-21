
class UserDAO {
    async findById(id) {
        return await User.findById(id);
    }

    async create(userData) {
    const newUser = new User(userData);
    return await newUser.save();
    }

    async update(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

export default new UserDAO();
