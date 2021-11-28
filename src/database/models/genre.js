const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
	genreName: {
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

const Genre = mongoose.model('Genre', genreSchema);
module.exports = Genre;
