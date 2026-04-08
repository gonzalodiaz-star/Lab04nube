const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'restaurante_user',
  password: process.env.DB_PASSWORD || 'restaurante_pass',
  database: process.env.DB_NAME || 'restaurante',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(config);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForMySQL(maxRetries = 20, retryDelay = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();

      console.log(`MySQL listo despues de ${attempt} intento(s).`);
      return;
    } catch (error) {
      console.log(
        `Esperando a MySQL... intento ${attempt}/${maxRetries} (${error.code || error.message})`
      );

      if (attempt === maxRetries) {
        throw new Error(`No fue posible conectar a MySQL: ${error.message}`);
      }

      await delay(retryDelay);
    }
  }
}

module.exports = { pool, waitForMySQL };
