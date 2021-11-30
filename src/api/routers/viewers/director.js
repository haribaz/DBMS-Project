const DirectorRouter = require('express').Router();

const DirectorModel = require('../../../database/models/director');
const UserModel = require('../../../database/models/user');

DirectorRouter.get('/show/:dirId', async (req, res) => {
	try {
		const dirId = req.params.dirId;
		const { id } = req.jwt_payload;

		const userObj = await UserModel.findById(id);

		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}

		const director = await DirectorModel.findById(dirId);

		if (!director) {
			return res.status(404).json({
				message: 'Director not found',
			});
		}

		let isfollowing;
		for (x in userObj.followingDirectors) {
			isfollowing = false;
			if (x._id === dirId) {
				isfollowing = true;
				break;
			}
		}

		const data = {
			name: director.name,
			bio: director.bio,
			coverImage: director.coverImage,
			movies: director.movies,
			isfollowing: isfollowing,
		};
		return res.status(200).json({
			details: data,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

DirectorRouter.get('/all', async (req, res) => {
	try {
		const name = req.query.title;
		const { id } = req.jwt_payload;

		const userObj = await UserModel.findById(id);

		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}

		let directorObjects;
		if (name) {
			directorObjects = await DirectorModel.find({
				name: {
					$regex: new RegExp(name, 'i'),
				},
			});
		} else {
			directorObjects = await DirectorModel.find();
		}

		if (!directorObjects) {
			return res.status(403).json({
				message: 'director not found',
			});
		}

		let directors = [];
		let isfollowing = false;
		for (const x of directorObjects) {
			isfollowing = false;
			for (const y of userObj.followingDirectors) {
				if (y.id === x._id) {
					isfollowing = true;
					break;
				}
			}
			directors.push({
				name: x.name,
				bio: x.bio,
				age: x.age,
				coverImage: x.coverImage,
				movies: x.movies,
				isfollowing: isfollowing,
			});
		}

		return res.status(200).json({
			details: directors,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = DirectorRouter;
