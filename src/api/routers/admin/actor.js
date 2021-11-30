const ActorRouter = require('express').Router();

const ActorModel = require('../../../database/models/actor');
const MovieModel = require('../../../database/models/movie');
const { uploadImg } = require('../../../middleware/multer');
// const { verifyAdminJWT } = require('../../middleware/jwt');
ActorRouter.get('/add', async (req, res) => {
	res.render('admin/addActor', { layout: 'layouts/admin' });
});

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
				res.redirect('/api/admin/actor/show/' + newActor._id);
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
			id: actor._id,
			name: actor.name,
			bio: actor.bio,
			age: actor.age,
			coverImage: actor.coverImage,
			movies: actor.movies,
		};
		res.render('admin/editActor', {
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

			return res.redirect('/api/admin/actor/show/' + id);
		} catch (err) {
			console.log(err.message);
			return res.status(500).json({
				message: 'Server Error, Try again later',
			});
		}
	}
);

ActorRouter.get('/show/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const actor = await ActorModel.findById(id).populate('movies');

		if (!actor) {
			return res.status(404).json({
				message: 'Actor not found',
			});
		}

		const data = {
			id: actor._id,
			name: actor.name,
			bio: actor.bio,
			age: actor.age,
			coverImage: actor.coverImage,
			movies: actor.movies,
		};
		res.render('admin/showActor', {
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

ActorRouter.get('/all', async (req, res) => {
	try {
		const name = req.query.title;

		let actorObjects;
		if (name) {
			actorObjects = await ActorModel.find({
				name: {
					$regex: new RegExp(name, 'i'),
				},
			}).populate('movies');
		} else {
			actorObjects = await ActorModel.find().populate('movies');
		}

		if (!actorObjects) {
			return res.status(403).json({
				message: 'actor not found',
			});
		}

		const actors = [];
		let best;

		for (const actor of actorObjects) {
			let x;
			if (actor.movies && actor.movies.length != 0) {
				x = actor.movies;
				x.sort((a, b) =>
					a.avgRating.value < b.avgRating.value ? 1 : -1
				);
				best = x[0].title;
			} else {
				best = ' - ';
			}
			const data = {
				id: actor._id,
				name: actor.name,
				bio: actor.bio,
				age: actor.age,
				coverImage: actor.coverImage,
				movies: actor.movies,
				bestMovie: best,
			};
			actors.push(data);
		}
		return res.render('admin/actor', {
			layout: 'layouts/admin',
			details: actors,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

ActorRouter.delete('/delete/:id', async (req, res) => {
	try {
		const actorId = req.params.id;
		const actorObj = await ActorModel.findById(actorId).populate('movies');
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
				const result = await ActorModel.findByIdAndDelete(actorObj._id);
				console.log(result);
				return res.redirect('/api/admin/actor/all');
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
