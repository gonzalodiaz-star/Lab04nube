const express = require('express');
const path = require('path');

const { pool, waitForMySQL } = require('./db');
const initDB = require('./initDB');
const clientesRouter = require('./routes/clientes');
const platosRouter = require('./routes/platos');

const app = express();
const PORT = Number(process.env.PORT || 9000);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.use('/clientes', clientesRouter);
app.use('/platos', platosRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'Ocurrio un error interno en el servidor.',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

async function startServer() {
  try {
    await waitForMySQL();
    await initDB();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la aplicacion:', error.message);
    process.exit(1);
  }
}

startServer();
