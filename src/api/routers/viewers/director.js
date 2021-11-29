const DirectorRouter = require('express').Router();

const DirectorModel = require('../../../database/models/director');

DirectorRouter.get('/name/:name', async (req, res) => {
	try {
		const name = req.params.name;

		const director = await DirectorModel.findOne({ name: name });

		if (!director) {
			return res.status(404).json({
				message: 'Director not found',
			});
		}

		const data = {
			name: director.name,
			bio: director.bio,
			coverImage: director.coverImage,
			movies: director.movies,
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
		const directorObjects = await DirectorModel.find();

		if (!directorObjects) {
			return res.status(403).json({
				message: 'director not found',
			});
		}

		return res.status(200).json({
			details: directorObjects,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = DirectorRouter;
