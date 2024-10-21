import express from 'express';
import UserRepository from '../repositories/UserRepository.js';
import UserDTO from '../dtos/UserDTO.js';

const router = express.Router();

router.get('/current', async (req, res) => {
    const user = await UserRepository.getUserById(req.user.id);
    const userDTO = new UserDTO(user); 
    res.json(userDTO);
});

export default router;
