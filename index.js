const express = require('express');
const axios = require('axios');
const cors = require('cors');   
require('dotenv').config(); // 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const MVOLA_CONSUMER_KEY = process.env.MVOLA_CONSUMER_KEY;
const MVOLA_CONSUMER_SECRET = process.env.MVOLA_CONSUMER_SECRET;

console.log("🔑 Clé MVola =", 0LPyJZjZW_V4JnbIIdZHb4bfkfIa);
console.log("🕵️‍♂️ Secret MVola =", FM0LhltxmRIWnRt0VNFfJ2nhAa0a);


app.get('/', (req, res) => {
  res.send('Gateway OK');
});

app.post('/pay', async (req, res) => {
  try {
   
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


app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});

