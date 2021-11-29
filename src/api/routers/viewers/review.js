ReviewRouter = require('express').Router();
const UserModel = require('../../../database/models/user');

ReviewRouter.get('/all', async (req, res) => {
	//const {id} = req.jwt_payload;
	try {
		const { id } = req.body;
		const userObj = await UserModel.findById(id);
		if (!userObj) {
			return res.status(400).json({
				message: 'User not found',
			});
		}

		return res.status(400).json({
			details: userObj.reviews,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = ReviewRouter;
