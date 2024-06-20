import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';

const SECRET_KEY = 'secret_key';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
};

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        const user = User.findById(jwt_payload._id);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
);
