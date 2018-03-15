const express = require('express');
const path = require('path');

const api = require('./api');

const app = express();

app.use('/api', api);
app.use('/server', express.static(path.resolve(__dirname, 'server')));
app.use('/client', express.static(path.resolve(__dirname, 'client')));

const server = app.listen(process.env.PORT || '3000', () => {
  console.log(`App listening on port ${server.address().port}`);
});
