const DirectorRouter = require('express').Router();

const DirectorModel = require('../../../database/models/director');
const { uploadImg } = require('../../../middleware/multer');
// const { verifyAdminJWT } = require('../../middleware/jwt');

DirectorRouter.get('/add', async (req, res) => {
	res.render('admin/addDirector', { layout: 'layouts/admin' });
});

DirectorRouter.post(
	'/add',
	uploadImg.fields([
		{
			name: 'coverImg',
			maxCount: 1,
		},
	]),
	async (req, res) => {
		try {
			const { name, bio } = req.body;

			if (!name || !bio || !req.files.coverImg) {
				return res.status(400).json({
					message: 'Fill all the fields',
				});
			}

			if (await DirectorModel.findOne({ name: name }))
				return res.status(400).json({
					message: 'Director already exists',
				});

			const newDirector = await DirectorModel.create({
				name: name,
				bio: bio,
				coverImage: req.files.coverImg[0].filename,
			});

			if (newDirector) {
				res.redirect('/api/admin/director/show/' + newDirector._id);
			}
		} catch (err) {
			console.log(err.message);
			return res.status(500).json({
				message: 'Server Error, Try again later',
			});
		}
	}
);

DirectorRouter.get('/show/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const director = await DirectorModel.findById(id).populate('movies');

		if (!director) {
			return res.status(404).json({
				message: 'Director not found',
			});
		}

		// let x;

		// if (!director.movies) {
		// 	x = director.movies;
		// 	x.sort((a, b) => (a.avgRating.value < b.avgRating.value ? 1 : -1));
		// }
		// console.log(x);

		const data = {
			id: director._id,
			name: director.name,
			bio: director.bio,
			coverImage: director.coverImage,
			movies: director.movies,
			// bestMovie: x[0],
		};
		// console.log(data);

		res.render('admin/showDirector', {
			layout: 'layouts/admin',
			details: data,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

DirectorRouter.get('/edit/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const director = await DirectorModel.findById(id);

		if (!director) {
			return res.status(404).json({
				message: 'Director not found',
			});
		}

		const data = {
			id: director._id,
			name: director.name,
			bio: director.bio,
			age: director.age,
			coverImage: director.coverImage,
			movies: director.movies,
		};
		res.render('admin/editDirector', {
			layout: 'layouts/admin',
			details: data,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

DirectorRouter.put(
	'/edit/:id',
	uploadImg.fields([
		{
			name: 'coverImg',
			maxCount: 1,
		},
	]),
	async (req, res) => {
		try {
			const id = req.params.id;
			const { name, bio, age } = req.body;

			const director = await DirectorModel.findById(id);

			if (!director) {
				return res.status(404).json({
					message: 'Director not found',
				});
			}

			director.name = name ? name : director.name;
			director.bio = bio ? bio : director.bio;
			director.age = age ? age : director.age;
			director.coverImage = req.files.coverImg
				? req.files.coverImg[0].filename
				: director.coverImg;

			await director.save();

			return res.redirect('/api/admin/director/show/' + id);
		} catch (err) {
			console.log(err.message);
			return res.status(500).json({
				message: 'Server Error, Try again later',
			});
		}
	}
);

DirectorRouter.get('/all', async (req, res) => {
	try {
		// const directorObjects = await DirectorModel.find();

		const name = req.query.title;

		let directorObjects;
		if (name) {
			directorObjects = await DirectorModel.find({
				name: {
					$regex: new RegExp(name, 'i'),
				},
			}).populate('movies');
		} else {
			directorObjects = await DirectorModel.find().populate('movies');
		}

		if (!directorObjects) {
			return res.status(403).json({
				message: 'director not found',
			});
		}

		const directors = [];
		let best;

		for (const dir of directorObjects) {
			let x;
			if (dir.movies && dir.movies.length != 0) {
				x = dir.movies;
				x.sort((a, b) =>
					a.avgRating.value < b.avgRating.value ? 1 : -1
				);
				best = x[0].title;
			} else {
				best = ' - ';
			}
			const data = {
				id: dir._id,
				name: dir.name,
				bio: dir.bio,
				coverImage: dir.coverImage,
				movies: dir.movies,
				bestMovie: best,
			};
			directors.push(data);
		}

		return res.render('admin/director', {
			layout: 'layouts/admin',
			details: directors,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

DirectorRouter.delete('/delete/:id', async (req, res) => {
	try {
		const dirId = req.params.id;
		const dirObj = await DirectorModel.findById(dirId);
		if (!dirObj) {
			return res.status(404).json({
				message: 'Director not found',
			});
		} else {
			if (dirObj.movies.length !== 0) {
				// return res.render('partials/error', {
				// 	message:
				// 		'Director part of movies in database. Cannot be deleted',
				// 	layout: 'layouts/admin',
				// });
				// popup.alert({
				// 	content:
				// 		'Director part of movies in database. Cannot be deleted',
				// });
				res.redirect('/api/admin/director/show/' + dirId);
			} else {
				try {
					const result = await DirectorModel.findByIdAndDelete(
						dirObj._id
					);
					return res.redirect('/api/admin/director/all');
				} catch (err) {
					return res.status(400).json({
						message: err.message,
					});
				}
			}
		}
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = DirectorRouter;
