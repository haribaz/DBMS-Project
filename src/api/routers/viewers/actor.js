const ActorRouter = require('express').Router();

const ActorModel = require('../../../database/models/actor');

ActorRouter.get('/name/:name', async (req, res) => {
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

ActorRouter.get('/all', async (req, res) => {
	try {
		const name = req.query.title;

		let actorObjects;
		if (name) {
			actorObjects = await ActorModel.find({
				name: {
					$regex: new RegExp(name, 'i'),
				},
			});
		} else {
			actorObjects = await ActorModel.find();
		}

		if (!actorObjects) {
			return res.status(403).json({
				message: 'actor not found',
			});
		}

		return res.status(200).json({
			details: actorObjects,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = ActorRouter;
