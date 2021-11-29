const MovieRouter = require('express').Router();

const MovieModel = require('../../../database/models/movie');
const DirectorModel = require('../../../database/models/director');
const ActorModel = require('../../../database/models/actor');
const GenreModel = require('../../../database/models/genre');

const { uploadImg } = require('../../../middleware/multer');
// const { verifyAdminJWT } = require('../../middleware/jwt');

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
			const {
				title,
				description,
				releaseDate,
				runtime,
				// createdAt,
				director,
				cast,
			} = req.body;

			if (
				!title ||
				!description ||
				!releaseDate ||
				!runtime ||
				// !createdAt ||
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

			for (const element of cast) {
				if (!(await ActorModel.findOne({ name: element })))
					return res.status(400).json({
						message: `The actor ${element} does not exist`,
					});
			}

			const newMovie = await MovieModel.create({
				title: title,
				description: description,
				releaseDate: releaseDate,
				runtime: runtime,
				// createdAt: createdAt,
				director: directorObj._id,
				// cast: cast, //populating cast below
				coverImage: req.files.coverImg[0].filename,
			});

			if (newMovie) {
				await DirectorModel.findOneAndUpdate(director, {
					$addToSet: { movies: newMovie._id },
					// $addToSet: { movies: { movie: newMovie._id } },
				});

				for (let element of cast) {
					console.log(element);
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
	}
);

MovieRouter.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const movie = await MovieModel.findById(id);

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

			//deleting for the genre
			// try {
			// 	await GenreModel.findByIdAndUpdate(movieObj.genre._id, {
			// 		$pull: { movies: movieId },
			// 	});
			// } catch (err) {
			// 	return res.status(400).json({
			// 		message: 'Error updating respective genre',
			// 	});
			// }

			//delete movie

			try {
				const result = await MovieModel.findByIdAndDelete(movieId);
				console.log(result);
				return res.status(200).json({
					message: 'Movie Deleted',
				});
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

module.exports = MovieRouter;
