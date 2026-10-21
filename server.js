const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const MINECRAFT_SERVER_IP = '://play.shadownetwork.shop';

app.api = app.get('/api/server-status', async (req, res) => {
  try {
    const response = await axios.get(`https://mcsrvstat.us{MINECRAFT_SERVER_IP}`);
    res.json({
      online: response.data.online,
      players: response.data.players ? response.data.players.online : 0,
      maxPlayers: response.data.players ? response.data.players.max : 0,
      version: response.data.version || 'Unknown'
    });
  } catch (error) {
    res.status(500).json({ online: false, error: 'Failed to fetch server status' });
  }
});

app.post('/api/checkout', (req, res) => {
  const { ign, packageId, email } = req.body;

  if (!ign || !packageId) {
    return res.status(400).json({ success: false, message: 'Minecraft username (IGN) and package are required.' });
  }


  console.log(`[STORE] Processing package ${packageId} for player ${ign} (${email})`);

  res.json({
    success: true,
    message: `Order received for ${ign}. Check your game inventory!`
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Minecraft store server running on http://localhost:${PORT}`);
});
