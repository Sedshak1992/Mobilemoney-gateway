const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool(); // Railway injecte automatiquement les variables PG

// Enregistrement d'une transaction
app.post("/pay", async (req, res) => {
  const { phone, operator, amount, merchant_id } = req.body;

  if (!phone || !operator || !amount || !merchant_id) {
    return res.status(400).json({ message: "Champs manquants." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (phone, operator, amount, merchant_id, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id, created_at`,
      [phone, operator, amount, merchant_id]
    );

    res.json({
      message: "Paiement enregistré avec succès.",
      transaction: result.rows[0]
    });
  } catch (err) {
    console.error("Erreur base de données :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// Voir toutes les transactions
app.get("/transactions", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM transactions ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur base de données :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
