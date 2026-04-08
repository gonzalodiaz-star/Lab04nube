const express = require('express');

const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, correo, creado_en FROM clientes ORDER BY id ASC'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({
      error: 'Los campos nombre y correo son obligatorios.'
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, correo) VALUES (?, ?)',
      [nombre, correo]
    );

    const [[cliente]] = await pool.query(
      'SELECT id, nombre, correo, creado_en FROM clientes WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(cliente);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Ya existe un cliente con ese correo.'
      });
    }

    next(error);
  }
});

module.exports = router;
