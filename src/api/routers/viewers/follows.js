const followsRouter = require('express').Router();
const ActorModel = require('../../../database/models/actor');
const DirModel = require('../../../database/models/director');
const GenreModel = require('../../../database/models/genre');
const UserModel = require('../../../database/models/user');
const { verifyUserJWT } = require('../../../middleware/jwt');

followsRouter.put('/genre/:genreId', verifyUserJWT, async (req, res) => {
	try {
		const { id } = req.jwt_payload;
		// const { id } = req.body._id;
		if (!id) {
			return res.status(400).json({
				message: 'User not Authenticate, Try to login again',
			});
		}
		const genreId = req.params.genreId;
		const genreObj = await GenreModel.findById(genreId);
		const userObj = await UserModel.findById(id);

		if (!genreObj) {
			return res.status(400).json({
				message: 'Genre not found',
			});
		} else if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		} else {
			let ind = userObj.followingGenres.findIndex(
				(ele) => ele._id == genreId
			);
			if (ind != -1) {
				//remove director
				userObj.followingGenres = userObj.followingGenres.filter(
					(ele) => {
						ele._id != genreId;
					}
				);
			} else {
				//add director
				userObj.followingGenres.push(genreObj);
			}
			await userObj.save();
			return res.status(200).json({
				message: 'Follow/Unfollow genre success',
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later ' + err.message,
		});
	}
});

followsRouter.put('/actor/:actorId', verifyUserJWT, async (req, res) => {
	try {
		const id = req.jwt_payload.id;
		// const { id } = req.body._id;

		if (!id) {
			return res.status(400).json({
				message: 'User not Authenticate, Try to login again',
			});
		}
		const actorId = req.params.actorId;
		const actorObj = await ActorModel.findById(actorId);
		const userObj = await UserModel.findById(id);

		if (!actorObj) {
			return res.status(400).json({
				message: 'Actor not found',
			});
		} else if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		} else {
			let ind = userObj.followingActors.findIndex(
				(ele) => ele._id == actorId
			);
			if (ind != -1) {
				//remove actor
				userObj.followingActors = userObj.followingActors.filter(
					(ele) => {
						ele._id != actorId;
					}
				);
			} else {
				//add actor
				userObj.followingActors.push(actorObj);
			}
			await userObj.save();
			return res.status(200).json({
				message: 'Follow/Unfollow actor success',
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});

followsRouter.put('/director/:dirId', verifyUserJWT, async (req, res) => {
	try {
		const { id } = req.jwt_payload;
		// const { id } = req.body._id;

		if (!id) {
			return res.status(400).json({
				message: 'User not Authenticate, Try to login again',
			});
		}
		const dirId = req.params.dirId;
		const dirObj = await DirModel.findById(dirId);
		const userObj = await UserModel.findById(id);

		if (!dirObj) {
			return res.status(400).json({
				message: 'Director not found',
			});
		} else if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		} else {
			let ind = userObj.followingDirectors.findIndex(
				(ele) => ele._id == dirId
			);
			if (ind != -1) {
				//remove director
				userObj.followingDirectors = userObj.followingDirectors.filter(
					(ele) => {
						ele._id != dirId;
					}
				);
			} else {
				//add director
				userObj.followingDirectors.push(dirObj);
			}
			await userObj.save();
			return res.status(200).json({
				message: 'Follow/Unfollow director success',
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error! Try Again Later',
		});
	}
});

module.exports = followsRouter;
