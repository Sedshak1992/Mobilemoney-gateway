const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Gateway OK');
});

app.post('/pay', async (req, res) => {
  const { montant, numero } = req.body;

  if (!montant || !numero) {
    return res.status(400).json({ message: 'Montant ou numéro manquant.' });
  }

  try {
    const credentials = Buffer.from(`${process.env.MVOLA_CONSUMER_KEY}:${process.env.MVOLA_CONSUMER_SECRET}`).toString('base64');

    const tokenResponse = await axios.post('https://developer.mvola.mg/oauth2/token', 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    const correlationId = uuidv4();
    const transactionId = uuidv4();

    const response = await axios.post(
      'https://devapi.mvola.mg/mvola/mm/transactions/type/merchantpay/1.0.0',
      {
        amount: montant,
        currency: 'Ar',
        descriptionText: 'Paiement JALAKO',
        requestDate: new Date().toISOString(),
        debitParty: [{ key: 'msisdn', value: numero }],
        creditParty: [{ key: 'msisdn', value: process.env.MVOLA_MSISDN }],
        metadata: [{ key: 'partnerName', value: 'JALAKO' }],
        requestingOrganisationTransactionReference: transactionId,
        originalTransactionReference: transactionId
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-CorrelationID': correlationId,
          'UserLanguage': 'FR',
          'UserAccountIdentifier': `msisdn;${numero}`,
          'partnerName': 'JALAKO',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Ocp-Apim-Subscription-Key': process.env.MVOLA_SUBSCRIPTION_KEY
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Erreur :', error.response?.data || error.message);
    res.status(500).json({ message: 'Erreur lors du paiement.', details: error.response?.data || error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});
