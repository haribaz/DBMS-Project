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
<<<<<<< HEAD
			movie: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Movie',
			},
=======
			// {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Movie',
			// },
>>>>>>> 3bc3b24 (bug fixes and testing)
		},
	],
});

const Actor = mongoose.model('Actor', actorSchema);
module.exports = Actor;
