const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtHelper');

exports.register = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const user = new User({ first_name, last_name, email, age, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(400).json({ message: 'Error en el registro', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error });
    }
};
