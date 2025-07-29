import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { getConnection } from "./config/db.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export function initializePassport() {
    const db = getConnection();
    const users = db.collection('users');

    // Strategy for handling username/password login
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await users.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Strategy for validating JWTs to protect routes
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await users.findOne({ _id: new ObjectId(jwt_payload.id) });
            if (user) {
                return done(null, user); // Success, user found
            } else {
                return done(null, false); // No user found
            }
        } catch (err) {
            return done(err, false);
        }
    }));
}