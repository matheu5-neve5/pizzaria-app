// Autenticação

require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const pool = require('./database.js');

// Configuração das opções do JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// Configurando a estratégia local do Passport para autenticação com email e senha
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        // Consulta o banco de dados para encontrar um usuário com o email fornecido
        const { rows } = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );
        const user = rows[0];

        // Caso não encontre o usuário, retorna a mensagem de erro
        if (!user) {
          return done(null, false, { message: 'Email incorreto.' });
        }

        // Compara a senha fornecida com a senha armazenada no banco de dados
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Se a senha for inválida, retorna a mensagem de erro
        if (!isPasswordValid) {
          return done(null, false, { message: 'Senha incorreta' });
        }

        // Se a senha for válida, retorna o usuário
        return done(null, user);
      } catch (error) {
        // Caso ocorra algum erro, retorna o erro
        return done(error);
      }
    }
  )
);

// Configurando a estratégia JWT do Passport para autenticação usando tokens JWT
passport.use(
  new JWTStrategy(jwtOptions, async (payload, done) => {
    try {
      // Consulta o banco de dados para encontrar um usuário com o ID presente no payload do JWT
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
        payload.sub,
      ]);
      const user = rows[0];

      // Caso não encontre o usuário, retorna a mensagem de erro
      if (!user) {
        return done(null, false, { message: 'Usuário não encontrado' });
      }

      // Se encontrar o usuário, retorna o usuário
      return done(null, user);
    } catch (error) {
      // Caso ocorra algum erro, retorna o erro
      return done(error);
    }
  })
);

module.exports = { passport };
