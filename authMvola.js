const axios = require('axios');
require('dotenv').config();

const CONSUMER_KEY = process.env.MVOLA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MVOLA_CONSUMER_SECRET;

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      'https://devapi.mvola.mg/token',
      'grant_type=client_credentials&scope=EXT_INT_MVOLA_SCOPE',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        }
      }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = new Date(new Date().getTime() + (response.data.expires_in * 1000) - 60000);

    return cachedToken;
  } catch (error) {
    console.error('Erreur récupération token MVola:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getAccessToken };
      
