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

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
