import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import pool from './database.js';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { sendConfirmationEmail } from './emailService.js';

// Criar um router do Express
const router = express.Router();

// Definir endpoint POST para registrar um novo usuário
router.post(
  '/register',
  [
    // Validações dos campos do usuário
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
    check('name', 'Name is required').notEmpty(),
  ],
  async (req, res) => {
    // Verificar se há erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Extrair os dados do corpo da requisição
    const { name, email, password } = req.body;

    try {
      // Verificar se já existe um usuário com este email
      const { rowCount } = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (rowCount > 0) {
        return res
          .status(400)
          .json({ error: 'Já existe um usuário com esse e-mail' });
      }

      // Criptografar a senha do usuário
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir o novo usuário no banco de dados
      const { rows } = await pool.query(
        'INSER INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
      );

      // Gere o token de confirmação
      const confirmationToken = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_CONFIRMATION_SECRET,
        { expiresIn: '1d' }
      );

      // Armazene o token de confirmação no banco de dados
      await pool.query(
        'INSERT INTO confirmation_tokens (user_id, token) VALUES ($1, $2)',
        [newUser.id, confirmationToken]
      );

      // Envie o e-mail de confirmação
      await sendConfirmationEmail(newUser.email, confirmationToken);

      // Retornar o novo usuário criado
      const newUser = rows[0];
      return res.status(201).json({ user: newUser });
    } catch (error) {
      // Tratar erros do servidor
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Definindo a rota POST para '/login'
router.post('/login', (req, res, next) => {
  // Autenticando usuário usando a estratégia local do Passport.js
  passport.authenticate('local', (err, user, info) => {
    // Se houver um erro na autenticação, retorne o erro
    if (err) {
      return next(err);
    }
    // Se não encontrar usuário, retorne um erro 400 com a mensagem de erro
    if (!user) {
      return res.status(400).json({ error: info.message });
    }

    // Se o usuário for autenticado com sucesso, inicia a sessão
    req.login(user, async (err) => {
      // Se houver um erro ao iniciar a sessão, retorne o erro
      if (err) {
        return next(err);
      }

      // Cria um token JWT com o ID do usuário como payload e expira em 1 hora
      const token = jwt.sign({ sub: user.id }, 'your_jwt_secret', {
        expiresIn: '1h',
      });
      // Retorna o token JWT na resposta
      return res.status(200).json({ token });
    });
  })(req, res, next);
});

// Exportando nosso router
export default router;
