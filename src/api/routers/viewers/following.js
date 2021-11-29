const FollowingRouter = require('express').Router();
const UserModel = require('../../../database/models/user');

FollowingRouter.get('/actors', async (req, res) => {
	try {
		//const {id} = req.jwt_payload;
		const { id } = req.body;
		const userObj = UserModel.findById(id);
		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}
		return res.status(200).json({
			details: userObj.followingActors,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});

FollowingRouter.get('/directors', async (req, res) => {
	try {
		//const {id} = req.jwt_payload;
		const { id } = req.body;
		const userObj = UserModel.findById(id);
		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}
		return res.status(200).json({
			details: userObj.followingDirectors,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});

FollowingRouter.get('/genres', async (req, res) => {
	try {
		//const {id} = req.jwt_payload;
		const { id } = req.body;
		const userObj = UserModel.findById(id);
		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}
		return res.status(200).json({
			details: userObj.followingGenres,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});

module.exports = FollowingRouter;
