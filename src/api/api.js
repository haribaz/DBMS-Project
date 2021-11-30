const api = require('express').Router();
//import routers here

// const { verifyJWT } = require('../middleware/jwt');
const admActorRouter = require('./routers/admin/actor');
const admDirectorRouter = require('./routers/admin/director');
const admMovieRouter = require('./routers/admin/movie');

const userActorRouter = require('./routers/viewers/actor');
const userDirectorRouter = require('./routers/viewers/director');
const userMovieRouter = require('./routers/viewers/movie');
const userSearchRouter = require('./routers/viewers/search');
const userFollowsRouter = require('./routers/viewers/follows');
const userGenreRouter = require('./routers/viewers/genre');
const userReviewRouter = require('./routers/viewers/review');
const userFollowingRouter = require('./routers/viewers/following');

const imageRouter = require('./routers/image');

const { verifyUserJWT, verifyAdminJWT } = require('../middleware/jwt');

api.use('/admin', verifyAdminJWT);

api.use('/admin/actor', admActorRouter);
api.use('/admin/director', admDirectorRouter);
api.use('/admin/movie', admMovieRouter);

api.use('/user', verifyUserJWT);

api.use('/user/actor', userActorRouter);
api.use('/user/director', userDirectorRouter);
api.use('/user/movie', userMovieRouter);
api.use('/user/search', userSearchRouter);
api.use('/user/follow', userFollowsRouter);
api.use('/user/following', userFollowingRouter);
api.use('/user/genre', userGenreRouter);
api.use('/user/review', userReviewRouter);

api.use('/images', imageRouter);

//add routers here

module.exports = api;
