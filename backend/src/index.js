const express = require('express');
const cors = require('cors');
const { convertUnit } = require('./conversions');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.post('/api/convert', (request, response) => {
  const { type, value } = request.body;

  try {
    const conversion = convertUnit(type, value);
    response.json(conversion);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API de conversion disponible sur http://localhost:${port}`);
  });
}

module.exports = app;
