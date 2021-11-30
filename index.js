require('dotenv').config({ path: './src/env/.env' });

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const apiRouter = require('./src/api/api');
const authRouter = require('./src/api/auth');
// const homeRouter = require('./src/api/routers/default');
const app = express();
const path = require('path');
const fs = require('fs');

console.log(process.env.MONGODB_URL);
console.log(process.env.PORT);
require('./src/database/setup.js');

if (!fs.existsSync('./images')) {
	fs.mkdirSync('./images');
}

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/src/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(methodOverride('_method'));
app.use(express.static('src/public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

app.get('/', async (req, res) => {
	res.redirect('/auth/login');
});
app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT || 3000);
