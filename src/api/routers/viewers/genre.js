const genreRouter = require('express').Router();

const genreModel = require('../../../database/models/genre');
const UserModel = require('../../../database/models/user');

genreRouter.get('/all', async (req, res) => {
	try {
		const genreObjects = await genreModel.find().populate('movies');
		const { id } = req.jwt_payload;

		const userObj = await UserModel.findById(id);

		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}

		if (!genreObjects) {
			return res.status(403).json({
				message: 'genre not found',
			});
		}

		let genres = [];
		let isfollowing = false;
		for (const x of genreObjects) {
			isfollowing = false;
			for (const y of userObj.followingGenres) {
				if (y._id.equals(x._id)) {
					isfollowing = true;
					break;
				}
			}
			genres.push({
				id: x._id,
				name: x.name,
				movies: x.movies,
				isfollowing: isfollowing,
			});
		}
		return res.render('users/genre', {
			details: genres,
			layout: 'layouts/user',
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

//should remove this

module.exports = genreRouter;
