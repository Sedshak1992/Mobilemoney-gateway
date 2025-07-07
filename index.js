// 🔧 Injection TEMPORAIRE des variables MVola pour contourner Railway
process.env.MVOLA_CONSUMER_KEY = process.env.MVOLA_CONSUMER_KEY || '0LPyJZjZW_V4JnbIIdZHb4bfkfIa';
process.env.MVOLA_CONSUMER_SECRET = process.env.MVOLA_CONSUMER_SECRET || 'FM0LhltxmRIWnRt0VNFfJ2nhAa0a';

console.log("🔑 Clé MVola =", process.env.MVOLA_CONSUMER_KEY);
console.log("🕵️‍♂️ Secret MVola =", process.env.MVOLA_CONSUMER_SECRET);
console.log("Forcing redeploy " + new Date());

const express = require('express');
require('dotenv').config();
const { getAccessToken } = require('./authMvola');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Gateway OK');
});

app.post('/pay', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ message: 'Token MVola récupéré avec succès', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du token MVola', error: error.message });
  }
});

app.get('/debug-env', (req, res) => {
  res.json({
    key: process.env.MVOLA_CONSUMER_KEY,
    secret: process.env.MVOLA_CONSUMER_SECRET
  });
});

console.log("🔍 Variables d’environnement détectées par Railway :");
console.log(process.env);

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});
