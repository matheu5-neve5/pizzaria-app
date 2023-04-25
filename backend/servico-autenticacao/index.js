// Serviço autenticação de login

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Serviço de autenticação');
});

app.listen(port, () => {
  console.log(`Serviço de Autenticação rodando na porta ${port}`);
});
