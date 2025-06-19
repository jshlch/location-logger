const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const LOG_FILE = path.join(__dirname, 'logs.json');

app.use(express.static('public'));
app.use(express.json());

app.post('/log', (req, res) => {
  const userAgent = req.headers['user-agent'];
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const logEntry = {
    ip,
    userAgent,
    location: req.body,
    timestamp: new Date().toISOString()
  };

  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    let logs = [];
    if (!err && data) {
      try {
        logs = JSON.parse(data);
      } catch (_) {}
    }

    logs.push(logEntry);

    fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), (err) => {
      if (err) console.error('Failed to write log:', err);
    });
  });

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
