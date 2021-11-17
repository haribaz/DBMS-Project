const api = require('express').Router();
//import routers here

const { verifyJWT } = require('../middleware/jwt');

api.use('/', verifyJWT);
//add routers here

module.exports = api;
