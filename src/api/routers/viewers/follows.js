const followsRouter = require('express').Router();
const ActorModel = require('../../../database/models/actor');
const DirModel = require('../../../database/models/director');
const GenreModel = require('../../../database/models/genre');
const UserModel = require('../../../database/models/user');
const { verifyUserJWT } = require('../../../middleware/jwt');

followsRouter.put('/genre/:genre', verifyUserJWT, async (req, res) => {
	try {
		const { email } = req.jwt_payload;
		if (!email) {
			return res.status(400).json({
				message: 'User not Authenticate, Try to login again',
			});
		}
		const genreName = req.params.genre;
		const genreObj = await GenreModel.findOne({ genreName: genreName });
		const userObj = await UserModel.findOne({ email: email });

		if (genreObj && userObj) {
			// add genre to the user
			userObj.followingGenres.push({ genre: genreObj });
			UserModel.findByIdAndUpdate(userObj._id, userObj)
				.then((updateResponse) => {
					console.log('Added successfully', updateResponse);
				})
				.catch((e) => {
					console.log('Error', e);
				});
		}
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});

followsRouter.put('/actor/:actorName', verifyUserJWT, async (req, res) => {
	try {
		const { email } = req.jwt_payload;
		if (!email) {
			return res.status(400).json({
				message: 'User not Authenticate, Try to login again',
			});
		}
		const actorName = req.params.actorName;
		const actorObj = await ActorModel.findOne({ name: actorName });
		const userObj = await UserModel.findOne({ email: email });

		if (actorObj && userObj) {
			// add genre to the user
			userObj.followingActors.push({ actor: actorObj });
			UserModel.findByIdAndUpdate(userObj._id, userObj)
				.then((updateResponse) => {
					console.log('Added successfully', updateResponse);
				})
				.catch((e) => {
					console.log('Error', e);
				});
		}
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});

followsRouter.put('/director/:dirName', verifyUserJWT, async (req, res) => {
	try {
		const { email } = req.jwt_payload;
		if (!email) {
			return res.status(400).json({
				message: 'User not Authenticate, Try to login again',
			});
		}
		const dirName = req.params.dirName;
		const dirObj = await DirModel.findOne({ name: dirName });
		const userObj = await UserModel.findOne({ email: email });

		if (dirObj && userObj) {
			// add genre to the user
			userObj.followingDirectors.push({ director: dirObj });
			UserModel.findByIdAndUpdate(userObj._id, userObj)
				.then((updateResponse) => {
					console.log('Added successfully', updateResponse);
				})
				.catch((e) => {
					console.log('Error', e);
				});
		}
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});
