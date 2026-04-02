require('dotenv').config();
const express = require('express');
const { processTicket } = require('./smart-reply-chain');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/process', async (req, res) => {
  try {
    const { ticketText } = req.body;
    const result = await processTicket(ticketText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Smart Reply Copilot running on http://localhost:3000');
});