const api = require('express').Router();
//import routers here

// const { verifyJWT } = require('../middleware/jwt');
const admActorRouter = require('./routers/admin/actor');
const admDirectorRouter = require('./routers/admin/director');
const admMovieRouter = require('./routers/admin/movie');

const userActorRouter = require('./routers/viewers/actor');
const userDirectorRouter = require('./routers/viewers/director');
const userMovieRouter = require('./routers/viewers/movie');
const userSearchRouter = require('./routers/viewers/movie');
// api.use('/', verifyJWT);

api.use('/admin/actor', admActorRouter);
api.use('/admin/director', admDirectorRouter);
api.use('/admin/movie', admMovieRouter);

api.use('/user/actor', userActorRouter);
api.use('/user/director', userDirectorRouter);
api.use('/user/movie', userMovieRouter);
api.use('/user/search', userSearchRouter);

//add routers here

module.exports = api;
