const SearchRouter = require('express').Router();

const MovieModel = require('../../../database/models/movie');
const DirectorModel = require('../../../database/models/director');
const ActorModel = require('../../../database/models/actor');
const GenreModel = require('../../../database/models/genre');

SearchRouter.get('/', async (req, res) => {
	try {
		const title = req.query.title;
		const genre = req.query.genre;
		const actor = req.query.actor;
		const director = req.query.director;
		console.log(title);

		const genreList = await GenreModel.find({});
		const actorList = await ActorModel.find({});
		const directorList = await DirectorModel.find({});

		let moviesByTitle;

		if (title) {
			moviesByTitle = await MovieModel.find({
				title: {
					$regex: new RegExp(title, 'i'),
				},
			})
				.populate('director')
				.populate('cast')
				.populate('genre');
		} else {
			moviesByTitle = await MovieModel.find({})
				.populate('director')
				.populate('cast')
				.populate('genre');
		}
		// console.log(moviesByTitle);
		let moviesByActor;
		let filteredMovies = moviesByTitle;

		if (actor) {
			const actorObj = await ActorModel.findOne({ name: actor });
			console.log('asd');
			// console.log(actorObj.movies);
			if (!actorObj || (actorObj && actorObj.movies.length == 0)) {
				return res.render('users/home', {
					details: [],
					genres: genreList,
					actors: actorList,
					directors: directorList,
					layout: 'layouts/userHome',
				});
			}
			moviesByActor = actorObj.movies;

			// console.log('moviesbyact:');
			// console.log(moviesByActor);
			// filteredMovies = moviesByTitle.filter(value => moviesByActor.includes(value));

			filteredMovies = moviesByTitle.filter((a) =>
				moviesByActor.some((b) => a._id.equals(b))
			);
		}

		let moviesByDirector;

		if (director) {
			console.log('dir');
			const dirObj = await DirectorModel.findOne({ name: director });
			if (!dirObj || (dirObj && dirObj.movies.length == 0)) {
				return res.render('users/home', {
					details: [],
					genres: genreList,
					actors: actorList,
					directors: directorList,
					layout: 'layouts/userHome',
				});
			}
			moviesByDirector = dirObj.movies;

			filteredMovies = filteredMovies.filter((a) =>
				moviesByDirector.some((b) => a._id.equals(b))
			);
		}

		let moviesByGenre;

		if (genre) {
			console.log('genre');
			const genreObj = await GenreModel.findOne({ name: genre });
			if (!genreObj || (genreObj && genreObj.movies.length == 0)) {
				return res.render('users/home', {
					details: [],
					genres: genreList,
					actors: actorList,
					directors: directorList,
					layout: 'layouts/userHome',
				});
			}
			moviesByGenre = genreObj.movies;

			filteredMovies = filteredMovies.filter((a) =>
				moviesByGenre.some((b) => a._id.equals(b))
			);
		}
		console.log(filteredMovies);
		if (!filteredMovies) {
			return res.render('users/home', {
				details: [],
				genres: genreList,
				actors: actorList,
				directors: directorList,
				layout: 'layouts/userHome',
			});
		}

		// const data = {
		// 	title: filteredMovies.title,
		// 	description: filteredMovies.description,
		// 	releaseDate: filteredMovies.releaseDate,
		// 	runtime: filteredMovies.runtime,
		// 	createdAt: filteredMovies.createdAt,
		// 	director: filteredMovies.director,
		// 	cast: filteredMovies.cast,
		// 	coverImage: filteredMovies.coverImage,
		// };

		console.log(filteredMovies);
		return res.render('users/home', {
			details: filteredMovies,
			genres: genreList,
			actors: actorList,
			directors: directorList,
			layout: 'layouts/userHome',
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = SearchRouter;
