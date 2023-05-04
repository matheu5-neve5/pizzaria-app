// Serviço autenticação de login

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRouter = require('./users.js');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Serviço de autenticação');
});

app.listen(port, () => {
  console.log(`Serviço de Autenticação rodando na porta ${port}`);
});
