const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
	name: {
		type: String,
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
			// movie: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Movie',
			// },
>>>>>>> 3bc3b24 (bug fixes and testing)
		},
	],
});

const Director = mongoose.model('Director', directorSchema);
module.exports = Director;
