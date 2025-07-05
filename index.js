// index.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Connexion PostgreSQL via les variables Railway
const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT, 10),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false }
});

// Route pour initier un paiement
app.post('/pay', async (req, res) => {
  const { phone, operator, amount, merchant_id } = req.body;
  if (!phone || !operator || !amount || !merchant_id) {
    return res.status(400).json({ message: 'Champs manquants.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO transactions
       (phone, operator, amount, merchant_id, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW())
       RETURNING id, created_at`,
      [phone, operator, amount, merchant_id]
    );
    res.status(201).json({
      message: 'Paiement enregistré avec succès.',
      transaction: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur base de données :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route pour lister toutes les transactions
app.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur base de données :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Optionnel : une route racine pour prouver que l'app tourne
app.get('/', (req, res) => {
  res.send('Mobile Money Gateway is running!');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
