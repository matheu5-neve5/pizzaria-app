// Serviço de seleção de sabores

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Serviço de Seleção dos Sabores');
});

app.listen(port, () => {
  console.log(`Serviço de Sabores rodando na porta ${port}`);
});
