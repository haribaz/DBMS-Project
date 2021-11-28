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
			movie: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Movie',
			},
		},
	],
});

const Director = mongoose.model('Director', directorSchema);
module.exports = Director;
