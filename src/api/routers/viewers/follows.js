const followsRouter = require('express').Router();
const ActorModel = require('../../../database/models/actor');
const DirModel = require('../../../database/models/director');
const GenreModel = require('../../../database/models/genre');
const UserModel = require('../../../database/models/user');
const { verifyUserJWT } = require('../../../middleware/jwt');

followsRouter.put('/genre/:genre', verifyUserJWT, async (req, res) => {
	try {
		const { id } = req.body._id;
		//const { id } = req.jwt_payload;
		if (!email) {
			return res.status(400).json({
				message: 'User not Authenticate, Try to login again',
			});
		}
		const genreName = req.params.genre;
		const genreObj = await GenreModel.findOne({ name: genreName });
		const userObj = await UserModel.UserModel.findById(id);

		if (!genreObj) {
			return res.status(400).json({
				message: 'Genre not found',
			});
		} else if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		} else {
			var ind = userObj.followingGenres.findIndex(
				(ele) => ele.name == genreName
			);
			if (ind != -1) {
				//remove director
				userObj.followingGenres = userObj.followingGenres.filter(
					(ele) => {
						ele.name != genreName;
					}
				);
			} else {
				//add director
				userObj.followingGenres.push(genreObj);
			}
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
		const { id } = req.body._id;
		//const { id } = req.jwt_payload;

		if (!email) {
			return res.status(400).json({
				message: 'User not Authenticate, Try to login again',
			});
		}
		const actorName = req.params.actorName;
		const actorObj = await ActorModel.findOne({ name: actorName });
		const userObj = await UserModel.UserModel.findById(id);

		if (!actorObj) {
			return res.status(400).json({
				message: 'Actor not found',
			});
		} else if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		} else {
			var ind = userObj.followingActors.findIndex(
				(ele) => ele.name == actorName
			);
			if (ind != -1) {
				//remove actor
				userObj.followingActors = userObj.followingActors.filter(
					(ele) => {
						ele.name != actorName;
					}
				);
			} else {
				//add actor
				userObj.followingActors.push(actorObj);
			}

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
		const { id } = req.body._id;
		//const { id } = req.jwt_payload;

		if (!email) {
			return res.status(400).json({
				message: 'User not Authenticate, Try to login again',
			});
		}
		const dirName = req.params.dirName;
		const dirObj = await DirModel.findOne({ name: dirName });
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
			var ind = userObj.followingDirectors.findIndex(
				(ele) => ele.name == dirName
			);
			if (ind != -1) {
				//remove director
				userObj.followingDirectors = userObj.followingDirectors.filter(
					(ele) => {
						ele.name != dirName;
					}
				);
			} else {
				//add director
				userObj.followingDirectors.push(dirObj);
			}
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

module.exports = followsRouter;
