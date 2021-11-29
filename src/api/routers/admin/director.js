const DirectorRouter = require('express').Router();

const DirectorModel = require('../../../database/models/director');
const { uploadImg } = require('../../../middleware/multer');
// const { verifyAdminJWT } = require('../../middleware/jwt');

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
				return res.status(200).json({
					message: 'Success',
				});
			}
		} catch (err) {
			console.log(err.message);
			return res.status(500).json({
				message: 'Server Error, Try again later',
			});
		}
	}
);

DirectorRouter.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const director = await DirectorModel.findById(id);

		if (!director) {
			return res.status(404).json({
				message: 'Director not found',
			});
		}

		const data = {
			name: director.name,
			bio: director.bio,
			coverImage: director.coverImage,
			movies: director.movies,
		};
		return res.status(200).json({
			details: data,
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
				return res.status(400).json({
					message:
						'Director part of movies in database. Cannot be deleted',
				});
			} else {
				try {
					const result = DirectorModel.findByIdAndDelete(dirObj._id);
					return res.status(200).json({
						message: 'Director Deleted',
					});
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
