const ActorRouter = require('express').Router();

const ActorModel = require('../../../database/models/actor');
const UserModel = require('../../../database/models/user');

ActorRouter.get('/show/:actorId', async (req, res) => {
	try {
		const actorId = req.params.actorId;
		const { id } = req.jwt_payload;

		const userObj = await UserModel.findById(id).populate(
			'followingActors'
		);

		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}

		const actor = await ActorModel.findById(actorId).populate('movies');

		if (!actor) {
			return res.status(404).json({
				message: 'Actor not found',
			});
		}

		let isfollowing;
		for (const x of userObj.followingActors) {
			isfollowing = false;
			if (x._id.equals(actor._id)) {
				isfollowing = true;
				break;
			}
		}

		const data = {
			id: actor._id,
			name: actor.name,
			bio: actor.bio,
			age: actor.age,
			coverImage: actor.coverImage,
			movies: actor.movies,
			isfollowing: isfollowing,
		};
		console.log(data.isfollowing);
		return res.render('users/showActor', {
			details: data,
			layout: 'layouts/user',
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
		const { id } = req.jwt_payload;

		const userObj = await UserModel.findById(id);

		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}

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

		let actors = [];
		let isfollowing;
		for (const x of actorObjects) {
			isfollowing = false;
			for (const y of userObj.followingActors) {
				if (y._id.equals(x._id)) {
					isfollowing = true;
					break;
				}
			}
			actors.push({
				id: x._id,
				name: x.name,
				bio: x.bio,
				age: x.age,
				coverImage: x.coverImage,
				movies: x.movies,
				isfollowing: isfollowing,
			});
			console.log(isfollowing);
		}

		return res.render('users/actor', {
			details: actors,
			layout: 'layouts/user',
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = ActorRouter;
