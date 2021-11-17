const AuthRouter = require('express').Router();
const bcrypt = require('bcrypt');

require('dotenv').configure({ path: '../../env/.env' });
const UserModel = require('../../database/models/user');

const { createJWT } = require('../../middleware/jwt');

AuthRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				message: 'Fill all the fields',
			});
		}
		const user = await UserModel.findOne({ email: email });

		// if user exists
		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				const token = await createJWT(user);
				return res.status(200).json({
					message: 'Success',
					token,
				});
			}
			return res.status(401).json({
				message: 'Incorrect username and password',
			});
		}

		return res.status(404).json({
			message: 'User not found',
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

AuthRouter.post('/register', async (req, res) => {
	//email, password, name in request
	try {
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = AuthRouter;
