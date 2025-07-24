const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const MVOLA_CONSUMER_KEY = process.env.MVOLA_CONSUMER_KEY;
const MVOLA_CONSUMER_SECRET = process.env.MVOLA_CONSUMER_SECRET;

console.log("🔑 Clé MVola =", MVOLA_CONSUMER_KEY);
console.log("🕵️‍♂️ Secret MVola =", MVOLA_CONSUMER_SECRET);

app.get('/', (req, res) => {
  res.send('Gateway OK');
});

app.post('/pay', async (req, res) => {
  const { montant, numero } = req.body;

  if (!montant || !numero) {
    return res.status(400).json({ message: 'Montant ou numéro manquant.' });
  }

  try {
    // Étape 1 : Obtenir le token d'accès
    const tokenResponse = await axios.post('https://api.mvola.mg/oauth/token', null, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${MVOLA_CONSUMER_KEY}:${MVOLA_CONSUMER_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        grant_type: 'client_credentials'
      }
    });

    const token = tokenResponse.data.access_token;

    // Étape 2 : Simuler un paiement (ici on ne fait qu'un retour de confirmation pour test)
    const responseMessage = {
      message: `Paiement de ${montant} MGA vers le numéro ${numero} initié avec succès.`,
      token_utilisé: token
    };

    res.json(responseMessage);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Erreur lors de la tentative de paiement.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});
