require('dotenv').config({ path: './src/env/.env' });

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const app = express();

console.log(process.env.MONGODB_URL);
console.log(process.env.PORT);
require('./src/database/setup.js');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

app.listen(process.env.PORT || 3000);
