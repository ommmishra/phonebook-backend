const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/router');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/', router);
app.listen(2222)
console.log('Server started at 2222')