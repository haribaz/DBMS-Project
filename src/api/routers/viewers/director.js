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

		const director = await DirectorModel.findById(dirId).populate('movies');

		if (!director) {
			return res.status(404).json({
				message: 'Director not found',
			});
		}

		let isfollowing;
		for (const x of userObj.followingDirectors) {
			isfollowing = false;
			if (x._id.equals(director._id)) {
				isfollowing = true;
				break;
			}
		}

		const data = {
			id: director._id,
			name: director.name,
			bio: director.bio,
			coverImage: director.coverImage,
			movies: director.movies,
			isfollowing: isfollowing,
		};
		return res.render('users/showDirector', {
			details: data,
			layout: 'layouts/user',
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
			}).populate('movies');
		} else {
			directorObjects = await DirectorModel.find().populate('movies');
		}

		if (!directorObjects) {
			return res.status(403).json({
				message: 'director not found',
			});
		}

		let directors = [];
		let isfollowing;
		for (const x of directorObjects) {
			isfollowing = false;
			for (const y of userObj.followingDirectors) {
				if (y._id.equals(x._id)) {
					isfollowing = true;
					break;
				}
			}
			directors.push({
				id: x._id,
				name: x.name,
				bio: x.bio,
				age: x.age,
				coverImage: x.coverImage,
				movies: x.movies,
				isfollowing: isfollowing,
			});
		}

		return res.render('users/director', {
			details: directors,
			layout: 'layouts/user',
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = DirectorRouter;
