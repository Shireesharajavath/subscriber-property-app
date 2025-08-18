const express = require('express');
const bodyParser = require('body-parser');
const setupRoutes = require('./rpc_config');

const app = express();
app.use(bodyParser.json());

setupRoutes(app);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
