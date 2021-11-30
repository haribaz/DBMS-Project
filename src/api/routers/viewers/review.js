ReviewRouter = require('express').Router();
const UserModel = require('../../../database/models/user');

ReviewRouter.get('/all', async (req, res) => {
	//const {id} = req.jwt_payload;
	try {
		const { id } = req.jwt_payload;
		const userObj = await UserModel.findById(id).populate([
			{ path: 'reviews', populate: { path: 'movieId' } },
		]);
		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}

		return res.render('users/reviews', {
			details: userObj.reviews,
			layout: 'layouts/user',
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = ReviewRouter;
