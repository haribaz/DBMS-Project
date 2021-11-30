const MovieRouter = require('express').Router();

const MovieModel = require('../../../database/models/movie');
const UserModel = require('../../../database/models/user');

const DirectorModel = require('../../../database/models/director');
const ActorModel = require('../../../database/models/actor');
const GenreModel = require('../../../database/models/genre');

MovieRouter.get('/title/:title', async (req, res) => {
	try {
		const title = req.params.title;

		const movie = await MovieModel.findOne({ title: title });

		if (!movie) {
			return res.status(404).json({
				message: 'Movie not found',
			});
		}

		const data = {
			title: movie.title,
			description: movie.description,
			releaseDate: movie.releaseDate,
			runtime: movie.runtime,
			createdAt: movie.createdAt,
			director: movie.director,
			cast: movie.cast,
			coverImage: movie.coverImage,
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

MovieRouter.post('/review/:movieId', async (req, res) => {
	try {
		const { id, name, review, rating } = req.body;
		//name from jwt payload
		//const { id, name } = req.jwt_payload;

		const movieId = req.params.movieId;
		const movieObj = await MovieModel.findById(movieId);
		const userObj = await UserModel.findById(id);

		//add for name and id also
		if (!id || !name || !review || !rating) {
			return res.status(400).json({
				message: 'Fill all fields',
			});
		}

		if (!movieObj) {
			return res.status(400).json({
				message: 'Movie not found',
			});
		}

		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}

		const revMovie = {
			userId: id,
			name: name,
			review: review,
			rating: rating,
		};

		const revUser = {
			movieId: movieId,
			review: review,
			rating: rating,
		};

		movieObj.reviews.push(revMovie);
		userObj.reviews.push(revUser);
		await movieObj.save();
		await userObj.save();
		return res.status(200).json({
			message: 'Successfully Added',
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});
// home page all movies - sorted by createdAt, recent first - movies of combined following actors and directors

MovieRouter.get('/home', async (req, res) => {
	try {
		const id = req.jwt_payload.id;
		// console.log(req.jwt_payload.email);
		const allMovies = await MovieModel.find().sort({ _id: -1 });

		if (!allMovies) {
			return res.status(404).json({
				message: 'No movies found',
			});
		}

		const userObj = await UserModel.findById(id);
		// console.log(userObj);
		const follActors = userObj.followingActors;
		const follDirectors = userObj.followingDirectors;
		const follGenres = userObj.followingGenres;
		// console.log(follActors);
		let suggestedMovies;
		let moviesByActors = [];
		let moviesByDirectors = [];
		let moviesByGenres = [];

		if (follActors) {
			let actors = [];

			for (let ele of follActors) {
				const actorObj = await ActorModel.findOne(
					{ _id: ele },
					{ _id: 0, movies: 1 }
				);
				// console.log('itr');
				// console.log(actorObj);
				if (actorObj && actorObj.length != 0) {
					actors.push(actorObj);
				}
			}

			for (let elem of actors) {
				for (let mov of elem.movies) {
					moviesByActors.push(mov);
				}
			}
		}

		if (follDirectors) {
			let dirs = [];
			for (let ele of follDirectors) {
				const dirObj = await DirectorModel.findOne(
					{ _id: ele },
					{ _id: 0, movies: 1 }
				);
				if (dirObj && dirObj.length != 0) {
					dirs.push(dirObj);
				}
			}
			// if (dirs && dirs.length !== 0) {
			// 	console.log(dirs);
			for (let ele of dirs) {
				console.log(ele);
				for (let mov of ele.movies) {
					moviesByDirectors.push(mov);
				}
			}
			// }
		}

		if (follGenres) {
			let genres = [];
			for (let ele of follGenres) {
				const genreObj = await GenreModel.findOne(
					{ _id: ele },
					{ _id: 0, movies: 1 }
				);
				if (genreObj && genreObj.length != 0) {
					genres.push(genreObj);
				}
			}

			// if (genres && genres.length !== 0) {
			// 	console.log('genre');
			for (let ele of genres) {
				console.log(mov);
				for (let mov of ele.movies) {
					moviesByGenres.push(mov);
				}
			}
			// }
		}
		let temp1 = [...new Set([...moviesByActors, ...moviesByDirectors])];

		let temp2 = [...new Set([...temp1, ...moviesByGenres])];

		// console.log(allMovies);
		suggestedMovies = allMovies.filter((a) =>
			temp2.some((b) => a._id.equals(b))
		);

		return res.status(200).json({
			details: suggestedMovies,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = MovieRouter;
