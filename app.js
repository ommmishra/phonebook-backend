const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./src/routes/router');
const sls = require('serverless-http');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/', router);

// app.listen(2222)
// console.log('Server started at 2222')

module.exports.server = sls(app);