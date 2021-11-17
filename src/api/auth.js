const auth = require('express').Router();

const userAuth = require('./routers/userAuth');

auth.use('/', userAuth);

module.exports = auth;
