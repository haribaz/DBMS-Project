const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	releaseDate: {
		type: Date,
		required: true,
	},
	runtime: {
		type: Number,
		required: true,
	},
	createdAt: {
		type: Date,
		requird: true,
		default: Date.now(),
	},
	coverImage: {
		type: String,
		required: true,
	},
	genre: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Genre',
	},
	director: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Director',
	},
	cast: [
		{
			// actor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Actor',
			// },
		},
	],
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
