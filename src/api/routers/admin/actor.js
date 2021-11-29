const ActorRouter = require('express').Router();

const ActorModel = require('../../../database/models/actor');
const MovieModel = require('../../../database/models/movie');
const { uploadImg } = require('../../../middleware/multer');
// const { verifyAdminJWT } = require('../../middleware/jwt');

ActorRouter.post(
	'/add',
	uploadImg.fields([
		{
			name: 'coverImg',
			maxCount: 1,
		},
	]),
	async (req, res) => {
		try {
			const { name, bio, age } = req.body;

			if (!name || !bio || !age || !req.files.coverImg) {
				return res.status(400).json({
					message: 'Fill all the fields',
				});
			}

			if (await ActorModel.findOne({ name: name }))
				return res.status(400).json({
					message: 'Actor already exists',
				});

			const newActor = await ActorModel.create({
				name: name,
				age: age,
				bio: bio,
				coverImage: req.files.coverImg[0].filename,
			});

			if (newActor) {
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

ActorRouter.get('/edit/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const actor = await ActorModel.findById(id);

		if (!actor) {
			return res.status(404).json({
				message: 'Actor not found',
			});
		}

		const data = {
			name: actor.name,
			bio: actor.bio,
			age: actor.age,
			coverImage: actor.coverImage,
			movies: actor.movies,
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

ActorRouter.put(
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
			const { name, bio, age } = req.body;

			const actor = await ActorModel.findById(id);

			if (!actor) {
				return res.status(404).json({
					message: 'Actor not found',
				});
			}

			actor.name = name ? name : actor.name;
			actor.bio = bio ? bio : actor.bio;
			actor.age = age ? age : actor.age;
			actor.coverImage = req.files.coverImg
				? req.files.coverImg[0].filename
				: actor.coverImg;

			await actor.save();

			return res.status(200).json({
				message: 'Actor Details updated successfully',
			});
		} catch (err) {
			console.log(err.message);
			return res.status(500).json({
				message: 'Server Error, Try again later',
			});
		}
	}
);

ActorRouter.get('/:name', async (req, res) => {
	try {
		const name = req.params.name;

		const actor = await ActorModel.findOne({ name: name });

		if (!actor) {
			return res.status(404).json({
				message: 'Actor not found',
			});
		}

		const data = {
			name: actor.name,
			bio: actor.bio,
			age: actor.age,
			coverImage: actor.coverImage,
			movies: actor.movies,
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

ActorRouter.delete('/delete/:name', async (req, res) => {
	try {
		const actorName = req.params.name;
		const actorObj = await ActorModel.findOne({ name: actorName });
		if (!actorObj) {
			return res.status(400).json({
				message: 'Actor not found',
			});
		} else {
			if (actorObj.movies.length !== 0) {
				return res.status(400).json({
					message:
						'Actor part of movies in database. Cannot be deleted',
				});
			} else {
				try {
					const result = ActorModel.findByIdAndDelete(actorObj._id);
					return res.status(200).json({
						message: 'Actor Deleted',
					});
				} catch (err) {
					return res.status(400).json({
						message: err.message,
					});
				}
			}
		}
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = ActorRouter;
