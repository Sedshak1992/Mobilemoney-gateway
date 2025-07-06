# Mobile Money Gateway

Ce projet est une petite API Node.js qui permet :

1. Vérifier que le serveur tourne (`GET /`)
2. Obtenir un token MVola (`POST /pay`)

---

## Comment tester :

### 1. Accéder à la racine (GET /)
- Va sur : `https://TON_URL_RAILWAY/`
- Réponse attendue : `Gateway OK`

### 2. Tester l'obtention du token (POST /pay)
- URL : `https://TON_URL_RAILWAY/pay`
- Requête POST vide (aucun corps nécessaire)
- Réponse : `Token MVola récupéré avec succès` + access_token

---

## Variables d’environnement (.env)

