const FollowingRouter = require('express').Router();
const UserModel = require('../../../database/models/user');

FollowingRouter.get('/actors', async (req, res) => {
	try {
		const { id } = req.jwt_payload;
		const userObj = await UserModel.findById(id).populate(
			'followingActors'
		);
		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}
		return res.render('users/followingActors', {
			details: userObj.followingActors,
			layout: 'layouts/user',
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later ' + err.message,
		});
	}
});

FollowingRouter.get('/directors', async (req, res) => {
	try {
		const { id } = req.jwt_payload;
		const userObj = await UserModel.findById(id).populate(
			'followingDirectors'
		);
		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}
		return res.render('users/followingDirectors', {
			details: userObj.followingDirectors,
			layout: 'layouts/user',
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});

FollowingRouter.get('/genres', async (req, res) => {
	try {
		const { id } = req.jwt_payload;
		const userObj = await UserModel.findById(id).populate([
			{ path: 'followingGenres', populate: { path: 'movies' } },
		]);
		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}
		return res.render('users/followingGenres', {
			details: userObj.followingGenres,
			layout: 'layouts/user',
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});

module.exports = FollowingRouter;
