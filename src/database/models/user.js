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
		minlength: 7,
		trim: true,
	},
	followingActors: [
		{
			actor: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Actor',
			},
		},
	],
	followingDirectors: [
		{
			director: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Director',
			},
		},
	],
	followingGenres: [
		{
			genre: {
				type: String,
				required: true,
			},
		},
	],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
