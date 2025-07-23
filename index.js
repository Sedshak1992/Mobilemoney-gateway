const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Variables d’environnement MVola
const MVOLA_CONSUMER_KEY = process.env.MVOLA_CONSUMER_KEY;
const MVOLA_CONSUMER_SECRET = process.env.MVOLA_CONSUMER_SECRET;

console.log("🔑 Clé MVola =", MVOLA_CONSUMER_KEY);
console.log("🕵️‍♂️ Secret MVola =", MVOLA_CONSUMER_SECRET);

// Route GET '/' simple
app.get('/', (req, res) => {
  res.send('Gateway OK');
});

// Route POST '/pay' : récupère un token MVola via l’API (exemple)
app.post('/pay', async (req, res) => {
  try {
    // Exemple d'appel API MVola pour obtenir token
    // Remplace l'URL et headers selon la doc officielle MVola
    const response = await axios.post('https://api.mvola.mg/oauth/token', null, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${MVOLA_CONSUMER_KEY}:${MVOLA_CONSUMER_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        grant_type: 'client_credentials'
      }
    });

    res.json({ success: true, token: response.data.access_token });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération du token MVola' });
  }
});

// Démarrage serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
