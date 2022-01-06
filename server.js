require('dotenv').config();
const appPort = process.env.APP_PORT || 3030;
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: false}));

app.use('/', routes);

app.listen(appPort, () => console.log(`Server running on port ${appPort}`));
