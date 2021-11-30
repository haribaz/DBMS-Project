const MovieRouter = require('express').Router();

const MovieModel = require('../../../database/models/movie');
const DirectorModel = require('../../../database/models/director');
const ActorModel = require('../../../database/models/actor');
const GenreModel = require('../../../database/models/genre');

const { uploadImg } = require('../../../middleware/multer');
// const { verifyAdminJWT } = require('../../middleware/jwt');

MovieRouter.get('/add', async (req, res) => {
	const directors = await DirectorModel.find({});
	const actors = await ActorModel.find({});
	const genres = await GenreModel.find({});
	// console.log(directors);
	data = {
		directors,
		actors,
		genres,
	};
	res.render('admin/addMovie', { layout: 'layouts/admin', details: data });
});

MovieRouter.post(
	'/add',
	uploadImg.fields([
		{
			name: 'coverImg',
			maxCount: 1,
		},
	]),
	async (req, res) => {
		try {
			console.log(req.body);
			const {
				title,
				description,
				releaseDate,
				runtime,
				// createdAt,
				genreName,
				director,
				cast,
			} = req.body;

			if (
				!title ||
				!description ||
				!releaseDate ||
				!runtime ||
				// !createdAt ||
				!genreName ||
				!director ||
				!cast ||
				!req.files.coverImg
			) {
				return res.status(400).json({
					message: 'Fill all the fields',
				});
			}

			if (await MovieModel.findOne({ title: title }))
				return res.status(400).json({
					message: 'Movie already exists',
				});

			const directorObj = await DirectorModel.findOne({ name: director });

			if (!directorObj)
				return res.status(400).json({
					message: 'Director does not exist',
				});

			const genreObj = await GenreModel.findOne({ name: genreName });

			if (!genreObj)
				return res.status(400).json({
					message: 'Genre does not exist',
				});

			if (cast.length > 5) {
				if (!(await ActorModel.findOne({ name: cast })))
					return res.status(400).json({
						message: `The actor ${cast} does not exist`,
					});
			} else {
				for (const element of cast) {
					if (!(await ActorModel.findOne({ name: element })))
						return res.status(400).json({
							message: `The actor ${element} does not exist`,
						});
				}
			}

			const newMovie = await MovieModel.create({
				title: title,
				description: description,
				releaseDate: releaseDate,
				runtime: runtime,
				// createdAt: createdAt,
				director: directorObj._id,
				genre: genreObj._id,
				// cast: cast, //populating cast below
				coverImage: req.files.coverImg[0].filename,
			});

			if (newMovie) {
				await DirectorModel.findOneAndUpdate(director, {
					$addToSet: { movies: newMovie._id },
					// $addToSet: { movies: { movie: newMovie._id } },
				});
				await GenreModel.findOneAndUpdate(
					{ name: genreName },
					{
						$addToSet: { movies: newMovie._id },
						// $addToSet: { movies: { movie: newMovie._id } },
					}
				);
				console.log(cast);

				if (cast.length > 5) {
					let actorObj = await ActorModel.findOneAndUpdate(
						{ name: cast },
						{
							$addToSet: { movies: newMovie._id },
							// $addToSet: { movies: { movie: newMovie._id } },
						}
					);
					await MovieModel.findByIdAndUpdate(newMovie._id, {
						$addToSet: { cast: actorObj._id },
						// $addToSet: { cast: { actor: actorObj._id } },
					});
				} else {
					for (let element of cast) {
						// console.log('element' + element);
						let actorObj = await ActorModel.findOneAndUpdate(
							{ name: element },
							{
								$addToSet: { movies: newMovie._id },
								// $addToSet: { movies: { movie: newMovie._id } },
							}
						);
						console.log(actorObj);
						await MovieModel.findByIdAndUpdate(newMovie._id, {
							$addToSet: { cast: actorObj._id },
							// $addToSet: { cast: { actor: actorObj._id } },
						});
					}
				}

				return res.redirect('/api/admin/movie/show/' + newMovie._id);
			}
		} catch (err) {
			console.log(err.message);
			return res.status(500).json({
				message: 'Server Error, Try again later',
			});
		}
	}
);

MovieRouter.get('/show/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const movie = await MovieModel.findById(id)
			.populate('director')
			.populate('genre')
			.populate('cast');

		if (!movie) {
			return res.status(404).json({
				message: 'Movie not found',
			});
		}

		const data = {
			id: movie._id,
			title: movie.title,
			description: movie.description,
			releaseDate: movie.releaseDate,
			runtime: movie.runtime,
			genre: movie.genre,
			reviews: movie.reviews,
			avgRating: movie.avgRating,
			createdAt: movie.createdAt,
			director: movie.director,
			cast: movie.cast,
			coverImage: movie.coverImage,
		};
		res.render('admin/showMovie', {
			layout: 'layouts/admin',
			details: data,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

MovieRouter.get('/edit/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const movie = await MovieModel.findById(id)
			.populate('director')
			.populate('genre')
			.populate('cast');

		if (!movie) {
			return res.status(404).json({
				message: 'Movie not found',
			});
		}
		console.log(movie.releaseDate);
		console.log(movie.description);
		const data = {
			id: movie._id,
			title: movie.title,
			description: movie.description,
			releaseDate: movie.releaseDate,
			genre: movie.genre,
			runtime: movie.runtime,
			createdAt: movie.createdAt,
			director: movie.director,
			cast: movie.cast,
			coverImage: movie.coverImage,
		};
		res.render('admin/editMovie', {
			layout: 'layouts/admin',
			details: data,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

MovieRouter.put(
	'/edit/:id',
	uploadImg.fields([
		{
			name: 'coverImg',
			maxCount: 1,
		},
	]),
	async (req, res) => {
		try {
			const id = req.params.id;
			const { title, description, releaseDate, runtime } = req.body;

			const movie = await MovieModel.findById(id);

			if (!movie) {
				return res.status(404).json({
					message: 'Movie not found',
				});
			}

			movie.title = title ? title : movie.title;
			movie.description = description ? description : movie.bio;
			movie.releaseDate = releaseDate ? releaseDate : movie.age;
			movie.runtime = runtime ? runtime : movie.age;

			movie.coverImage = req.files.coverImg
				? req.files.coverImg[0].filename
				: movie.coverImg;

			await movie.save();

			return res.redirect('/api/admin/movie/show/' + id);
		} catch (err) {
			console.log(err.message);
			return res.status(500).json({
				message: 'Server Error, Try again later',
			});
		}
	}
);

MovieRouter.delete('/delete/:id', async (req, res) => {
	try {
		const movieId = req.params.id;
		const movieObj = await MovieModel.findById(movieId);
		if (!movieObj) {
			return res.status(400).json({
				message: 'Movie not found',
			});
		} else {
			//delete this movie in actors
			for (const ele of movieObj.cast) {
				try {
					await ActorModel.findByIdAndUpdate(ele._id, {
						$pull: { movies: movieId },
					});
				} catch (err) {
					return res.status(400).json({
						message:
							'Error updating respective actor' + err.message,
					});
				}
			}

			//deleting for the director
			try {
				await DirectorModel.findByIdAndUpdate(movieObj.director._id, {
					$pull: { movies: movieId },
				});
			} catch (err) {
				return res.status(400).json({
					message: 'Error updating respective director',
				});
			}

			try {
				await GenreModel.findByIdAndUpdate(movieObj.genre._id, {
					$pull: { movies: movieId },
				});
			} catch (err) {
				return res.status(400).json({
					message: 'Error updating respective genre',
				});
			}

			//delete movie

			try {
				const result = await MovieModel.findByIdAndDelete(movieId);
				console.log(result);
				res.redirect('/api/admin/movie/all');
			} catch (err) {
				return res.status(400).json({
					message: err.message,
				});
			}
		}
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

MovieRouter.get('/all', async (req, res) => {
	try {
		// const movieObjects = await MovieModel.find();

		const name = req.query.title;

		let movieObjects;
		if (name) {
			movieObjects = await MovieModel.find({
				title: {
					$regex: new RegExp(name, 'i'),
				},
			})
				.populate('director')
				.populate('genre')
				.populate('cast');
		} else {
			movieObjects = await MovieModel.find()
				.populate('director')
				.populate('genre')
				.populate('cast');
		}

		if (!movieObjects) {
			return res.status(403).json({
				message: 'Movies not found',
			});
		}

		return res.render('admin/movie', {
			layout: 'layouts/admin',
			details: movieObjects,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = MovieRouter;
