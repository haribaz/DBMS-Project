const api = require('express').Router();
//import routers here

// const { verifyJWT } = require('../middleware/jwt');
const ActorRouter = require('./routers/admin/actor');
const DirectorRouter = require('./routers/admin/director');
const MovieRouter = require('./routers/admin/movie');
// api.use('/', verifyJWT);

api.use('/admin/actor', ActorRouter);
api.use('/admin/director', DirectorRouter);
api.use('/admin/movie', MovieRouter);

//add routers here

module.exports = api;
