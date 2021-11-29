const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	followingActors: [
		{
			// actor: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Actor',
			// },
		},
	],
	followingDirectors: [
		{
			// director: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Director',
			// },
		},
	],
	followingGenres: [
		{
			// genre: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Genre',
			// },
		},
	],
	reviews: [{}],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
