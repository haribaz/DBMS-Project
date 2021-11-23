require('dotenv').config({ path: './src/env/.env' });

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const app = express();
const path = require('path');

console.log(process.env.MONGODB_URL);
console.log(process.env.PORT);
require('./src/database/setup.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/src/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(methodOverride('_method'));
app.use(express.static('src/public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

app.get('/login', (req, res) => {
	res.render('login', { layout: 'layouts/login' });
});

app.get('/register', (req, res) => {
	res.render('register', { layout: 'layouts/login' });
});

app.get('/user/home', (req, res) => {
	res.render('users/home', { layout: 'layouts/userHome' });
});

app.get('/user/following', (req, res) => {
	res.render('users/following', { layout: 'layouts/user' });
});

app.get('/user/reviews', (req, res) => {
	res.render('users/reviews', { layout: 'layouts/user' });
});

app.get('/admin/movies', (req, res) => {
	res.render('admin/movie', { layout: 'layouts/admin' });
})

app.get('/admin/actors', (req, res) => {
	res.render('admin/actor', { layout: 'layouts/admin' });
})

app.get('/admin/directors', (req, res) => {
	res.render('admin/director', { layout: 'layouts/admin' });
})

app.get('/admin/addMovie', (req, res) => {
	res.render('admin/addMovie', { layout: 'layouts/admin' });
})

app.get('/admin/addActor', (req, res) => {
	res.render('admin/addActor', { layout: 'layouts/admin' });
})

app.get('/admin/addDirector', (req, res) => {
	res.render('admin/addDirector', { layout: 'layouts/admin' });
})

app.listen(process.env.PORT || 3000);
