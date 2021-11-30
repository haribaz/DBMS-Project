const genreRouter = require('express').Router();

const genreModel = require('../../../database/models/genre');
const UserModel = require('../../../database/models/user');

genreRouter.get('/all', async (req, res) => {
	try {
		const genreObjects = await genreModel.find();
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
				if (y.id === x._id) {
					isfollowing = true;
					break;
				}
			}
			genres.push({
				name: x.name,
				movies: x.movies,
				isfollowing: isfollowing,
			});
		}
		return res.status(200).json({
			details: genres,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

//should remove this
genreRouter.post('/add', async (req, res) => {
	try {
		const { genreName } = req.body;

		if (!genreName) {
			return res.status(400).json({
				message: 'Fill all the fields',
			});
		}

		if (await genreModel.findOne({ name: genreName }))
			return res.status(400).json({
				message: 'Genre already exists',
			});

		const newGenre = await genreModel.create({
			name: genreName,
			movies: [],
		});

		if (newGenre) {
			return res.status(200).json({
				message: 'Success',
			});
		}
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = genreRouter;
