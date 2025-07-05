const { Pool } = require('pg');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

app.post('/pay', async (req, res) => {
  const { phone, operator, amount, merchant_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (phone, operator, amount, merchant_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at',
      [phone, operator, amount, merchant_id, 'pending']
    );
    res.json({ message: 'Paiement enregistré avec succès.', transaction: result.rows[0] });
  } catch (error) {
    console.error('Erreur base de données :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

app.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur base de données :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
        
