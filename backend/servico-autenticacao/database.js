const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pizzaria_app_auth',
  password: '8352850!Aff',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco de dados:', err.stack);
  }

  console.log('Conexão bem-sucedida com o banco de dados.');

  client.query('SELECT NOW()', (err, result) => {
    release();

    if (err) {
      return console.error(
        'Erro ao testar a conexão com o banco de dados:',
        err.stack
      );
    }

    console.log(
      'Teste de conexão com o banco de dados bem-sucedido:',
      result.rows[0].now
    );
  });
});

module.exports = pool;
