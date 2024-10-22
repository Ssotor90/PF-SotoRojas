import express from 'express';
import UserRepository from '../repositories/UserRepository.js';
import UserDTO from '../dtos/UserDTO.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/current', async (req, res) => {
    const user = await UserRepository.getUserById(req.user.id);
    const userDTO = new UserDTO(user); 
    res.json(userDTO);
});

export default router;
