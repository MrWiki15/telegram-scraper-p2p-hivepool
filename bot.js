require("dotenv").config(); // Para usar variables de entorno
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { startBot, getMessages } = require("./t-scraper-p2p-hivepool.js");

startBot(); // Inicia el bot cuando el servidor arranca

app.get("/messages", (req, res) => {
  const messages = getMessages();
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
