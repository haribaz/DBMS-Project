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
			movie: {
				id: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Movie',
			},
		},
	],
});

const Actor = mongoose.model('Actor', actorSchema);
module.exports = Actor;
