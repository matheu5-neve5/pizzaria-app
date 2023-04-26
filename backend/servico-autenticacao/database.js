// backend/servico-autenticacao/database.js

import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pizzaria_app_auth',
  password: '8352850!Aff',
  port: 5432,
});

export default pool;
