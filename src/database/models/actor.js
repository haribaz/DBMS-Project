const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	bio: {
		type: String,
		required: true,
	},
	coverImage: {
		type: String,
		required: true,
	},
	movies: [
		{
			// {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Movie',
			// },
		},
	],
});

const Actor = mongoose.model('Actor', actorSchema);
module.exports = Actor;
