const MovieRouter = require('express').Router();

const MovieModel = require('../../../database/models/movie');
const UserModel = require('../../../database/models/user');

MovieRouter.get('/:title', async (req, res) => {
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

module.exports = MovieRouter;
