const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/pay", (req, res) => {
  const { phone, operator, amount, merchant_id } = req.body;
  if (!phone || !operator || !amount || !merchant_id) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  res.json({ message: "Payment received. Pending confirmation." });
});

app.post("/callback", (req, res) => {
  res.json({ message: "Payment confirmed." });
});

app.get("/transactions", (req, res) => {
  res.json([]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
         
