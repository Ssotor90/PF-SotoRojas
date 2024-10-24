import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtHelper.js';

export const register = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        const user = new User({ first_name, last_name, email, age, password: hashedPassword });
        await user.save();
        
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(400).json({ message: 'Error en el registro', error });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas: usuario no encontrado' });
        }

        console.log("Contraseña ingresada:", password);
        console.log("Contraseña en la base de datos:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Coincidencia de contraseña:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas: contraseña incorrecta' });
        }

        const token = generateToken(user);
        res.status(200).json({ 
            message: 'Credenciales correctas',
            token 
        });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: 'Error en el login', error });
    }
};
