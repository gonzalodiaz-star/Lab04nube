const express = require('express');

const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, descripcion, precio, creado_en FROM platos ORDER BY id ASC'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { nombre, descripcion, precio } = req.body;

  if (!nombre || !descripcion || precio === undefined) {
    return res.status(400).json({
      error: 'Los campos nombre, descripcion y precio son obligatorios.'
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO platos (nombre, descripcion, precio) VALUES (?, ?, ?)',
      [nombre, descripcion, precio]
    );

    const [[plato]] = await pool.query(
      'SELECT id, nombre, descripcion, precio, creado_en FROM platos WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(plato);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
