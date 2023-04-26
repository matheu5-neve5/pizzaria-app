// autenticação

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import pool from './database.js';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret',
};

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
          payload.sub,
        ]);
        const user = rows[0];

        if (!user) {
          return done(null, false, { message: 'Email incorreto.' });
        }

        const isPasswordValid = await bcrypto.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Senha incorreta' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(jwtOptions, async (payload, done) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
        payload.sub,
      ]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Usuário não encontrado' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

export default passport;
