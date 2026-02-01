// import express from 'express';
// import { query } from './database/db.js';
// const app = express();

// app.get('/test-db', async (req, res) => {
//   try {
//     const result = await query('SELECT NOW()');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Database connection error');
//   }
// });