const DirectorRouter = require('express').Router();

const DirectorModel = require('../../../database/models/director');

DirectorRouter.get('/:name', async (req, res) => {
	try {
		const name = req.params.name;

		const director = await DirectorModel.findOne({ name: name });

		if (!director) {
			res.status(404).json({
				message: 'Director not found',
			});
		}

		const data = {
			name: director.name,
			bio: director.bio,
			coverImage: director.coverImage,
			movies: director.movies,
		};
		res.status(200).json({
			details: data,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = DirectorRouter;