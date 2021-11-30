const genreRouter = require('express').Router();

const genreModel = require('../../../database/models/genre');

genreRouter.get('/all', async (req, res) => {
	try {
		const genreObjects = await genreModel.find();

		if (!genreObjects) {
			return res.status(403).json({
				message: 'genre not found',
			});
		}
		return res.status(200).json({
			details: genreObjects,
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
