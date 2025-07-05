Mobile Money Gateway

Ce projet est une petite API qui permet :
1. De vérifier que le serveur tourne en ouvrant l’adresse principale.
2. D’enregistrer un paiement avec une requête POST.
3. De lister tous les paiements avec une requête GET.

—————————————————————————

Comment tester :

1) Ouvre l’adresse principale (GET /)
   - Va dans ton navigateur à : https://TON_URL_RAILWAY/
   - Tu dois voir : Gateway OK

2) Enregistrer un paiement (POST /pay)
   - URL : https://TON_URL_RAILWAY/pay
   - Corps de la requête (format JSON) :
     {
       "phone": "0321234567",
       "operator": "MVola",
       "amount": 20000,
       "merchant_id": "foko-shop"
     }
   - Tu obtiens en réponse la confirmation et l’ID.

3) Lister les paiements (GET /transactions)
   - URL : https://TON_URL_RAILWAY/transactions
   - Tu obtiens en réponse la liste de tous les paiements.

(Remplace `https://TON_URL_RAILWAY` par l’adresse donnée par Railway, par exemple :  
`https://mobilemoney-gateway-production.up.railway.app`)
