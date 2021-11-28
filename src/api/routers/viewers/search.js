const SearchRouter = require('express').Router();

const MovieModel = require('../../../database/models/movie');
const DirectorModel = require('../../../database/models/director');
const ActorModel = require('../../../database/models/actor');


SearchRouter.get('/', async (req, res) => {
	try {
		const title = req.query.title;
		// const genre = req.query.genre;
		const actor = req.query.actor;
		const director = req.query.director;

		const moviesByTitle;

		if (title) {
			moviesByTitle = await MovieModel.find({ title: {
				$regex: new RegExp(title, "i"),
			} });
		} else {
			moviesByTitle = await MovieModel.find({});
		}

		const moviesByActor;
		let filteredMovies;

		if (actor) {
			const actorObj = await ActorModel.findOne({ name: actor });
			moviesByActor = actorObj.movies;

			// filteredMovies = moviesByTitle.filter(value => moviesByActor.includes(value));

			filteredMovies = moviesByTitle.filter(a => moviesByActor.some(b => a._id === b._id));
		} 

		const moviesByDirector;

		if (director) {
			const directorObj = await DirectorModel.findOne({ name: director });
			moviesByDirector = directorObj.movies;

			filteredMovies = filteredMovies.filter(a => moviesByDirector.some(b => a._id === b._id));
		}
		

		if (!filteredMovies) {
			return res.status(200).json({
				message: 'No movies found',
			});
		}

		const data = {
			title: filteredMovies.title,
			description: filteredMovies.description,
			releaseDate: filteredMovies.releaseDate,
			runtime: filteredMovies.runtime,
			createdAt: filteredMovies.createdAt,
			director: filteredMovies.director,
			cast: filteredMovies.cast,
			coverImage: filteredMovies.coverImage,
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

module.exports = SearchRouter;
