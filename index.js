require('dotenv').config({ path: './src/env/.env' });

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const fs = require('fs');

console.log(process.env.MONGODB_URL);
console.log(process.env.PORT);
require('./src/database/setup.js');

if (!fs.existsSync('./images')) {
	fs.mkdirSync('./images');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/src/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(methodOverride('_method'));
app.use(express.static('src/public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

//login and register
// app.get('/login', (req, res) => {
// 	res.render('login', { layout: 'layouts/login' });
// });

// app.get('/register', (req, res) => {
// 	res.render('register', { layout: 'layouts/login' });
// });

// //users
// app.get('/user/home', (req, res) => {
// 	res.render('users/home', { layout: 'layouts/userHome' });
// });

// app.get('/user/actors', (req, res) => {
// 	res.render('users/actor', { layout: 'layouts/user' });
// });

// app.get('/user/directors', (req, res) => {
// 	res.render('users/director', { layout: 'layouts/user' });
// });

// app.get('/user/genres', (req, res) => {
// 	res.render('users/genre', { layout: 'layouts/user' });
// });

// app.get('/user/following/actors', (req, res) => {
// 	res.render('users/followingActors', { layout: 'layouts/user' });
// });

// app.get('/user/following/directors', (req, res) => {
// 	res.render('users/followingDirectors', { layout: 'layouts/user' });
// });

// app.get('/user/following/genres', (req, res) => {
// 	res.render('users/followingGenres', { layout: 'layouts/user' });
// });

// app.get('/user/showMovie', (req, res) => {
// 	res.render('users/showMovie', { layout: 'layouts/user' });
// });

// app.get('/user/showActor', (req, res) => {
// 	res.render('users/showActor', { layout: 'layouts/user' });
// });

// app.get('/user/showDirector', (req, res) => {
// 	res.render('users/showDirector', { layout: 'layouts/user' });
// });

// app.get('/user/reviews', (req, res) => {
// 	res.render('users/reviews', { layout: 'layouts/user' });
// });

// //admin
// app.get('/admin/movies', (req, res) => {
// 	res.render('admin/movie', { layout: 'layouts/admin' });
// });

// app.get('/admin/actors', (req, res) => {
// 	res.render('admin/actor', { layout: 'layouts/admin' });
// });

// app.get('/admin/directors', (req, res) => {
// 	res.render('admin/director', { layout: 'layouts/admin' });
// });

// app.get('/admin/addMovie', (req, res) => {
// 	res.render('admin/addMovie', { layout: 'layouts/admin' });
// });

// app.get('/admin/editMovie', (req, res) => {
// 	res.render('admin/editMovie', { layout: 'layouts/admin' });
// });

// app.get('/admin/addActor', (req, res) => {
// 	res.render('admin/addActor', { layout: 'layouts/admin' });
// });

// app.get('/admin/editActor', (req, res) => {
// 	res.render('admin/editActor', { layout: 'layouts/admin' });
// });

// app.get('/admin/addDirector', (req, res) => {
// 	res.render('admin/addDirector', { layout: 'layouts/admin' });
// });

// app.get('/admin/editDirector', (req, res) => {
// 	res.render('admin/editDirector', { layout: 'layouts/admin' });
// });

// app.get('/admin/showMovie', (req, res) => {
// 	res.render('admin/showMovie', { layout: 'layouts/admin' });
// });

// app.get('/admin/showDirector', (req, res) => {
// 	res.render('admin/showDirector', { layout: 'layouts/admin' });
// });
// app.get('/admin/showActor', (req, res) => {
// 	res.render('admin/showActor', { layout: 'layouts/admin' });
// });

app.listen(process.env.PORT || 3000);
