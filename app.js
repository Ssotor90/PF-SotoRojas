import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport'; 
import passportConfig from './src/config/passport.js'; 
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.log('Error conectando a MongoDB:', error));

const app = express();

app.use(express.json());
app.use(cookieParser());

passportConfig(passport);
app.use(passport.initialize());

app.use('/api/sessions', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
