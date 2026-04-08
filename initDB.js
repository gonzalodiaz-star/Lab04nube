const { pool } = require('./db');

async function seedIfEmpty(tableName, countQuery, insertQuery, values) {
  const [[result]] = await pool.query(countQuery);

  if (result.total > 0) {
    return;
  }

  await pool.query(insertQuery, [values]);
  console.log(`Datos iniciales insertados en ${tableName}.`);
}

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      correo VARCHAR(100) NOT NULL UNIQUE,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS platos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      descripcion VARCHAR(255) NOT NULL,
      precio DECIMAL(8, 2) NOT NULL,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await seedIfEmpty(
    'clientes',
    'SELECT COUNT(*) AS total FROM clientes',
    'INSERT INTO clientes (nombre, correo) VALUES ?',
    [
      ['Ana Torres', 'ana@restaurante.com'],
      ['Luis Perez', 'luis@restaurante.com'],
      ['Camila Rojas', 'camila@restaurante.com']
    ]
  );

  await seedIfEmpty(
    'platos',
    'SELECT COUNT(*) AS total FROM platos',
    'INSERT INTO platos (nombre, descripcion, precio) VALUES ?',
    [
      ['Lomo Saltado', 'Carne salteada con cebolla, tomate y papas crocantes.', 32.5],
      ['Ceviche Clasico', 'Pescado fresco marinado en limon con choclo y camote.', 29.9],
      ['Risotto de Hongos', 'Arroz cremoso con hongos salteados y parmesano.', 27.0]
    ]
  );

  console.log('Base de datos inicializada correctamente.');
}

module.exports = initDB;
