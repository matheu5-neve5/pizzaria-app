// Serviço do carrinho de compras

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3003;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Serviço de Carrinho de Compras');
});

app.listen(port, () => {
  console.log(`Serviço de Carrinho de Compras rodando na porta ${port}`);
});
