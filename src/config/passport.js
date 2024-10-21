import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

const configurePassport = (passport) => {
    passport.use(
        new JwtStrategy(options, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) return done(null, user);
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
        })
    );
};

export default configurePassport;
