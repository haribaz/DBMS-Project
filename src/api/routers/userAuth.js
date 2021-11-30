const AuthRouter = require('express').Router();
const bcrypt = require('bcrypt');

require('dotenv').config({ path: '../../env/.env' });
const UserModel = require('../../database/models/user');
const AdminModel = require('../../database/models/admin');

const { createUserJWT, createAdminJWT } = require('../../middleware/jwt');

AuthRouter.post('/login', async (req, res) => {
	try {
		const { email, password, isAdm } = req.body;
		console.log(req.body);
		if (!email || !password || !isAdm) {
			return res.status(400).json({
				message: 'Fill all the fields',
			});
		}

		if (isAdm != 'true') {
			const user = await UserModel.findOne({ email: email });
			// if user exists
			if (user) {
				if (await bcrypt.compare(password, user.password)) {
					const token = await createUserJWT(user);
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
		} else {
			const admin = await AdminModel.findOne({ email: email });
			// if user exists
			if (admin) {
				if (await bcrypt.compare(password, admin.password)) {
					const token = await createAdminJWT(admin);
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
		}
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

AuthRouter.post('/register', async (req, res) => {
	try {
		const { email, name, password, cpassword, isAdm } = req.body;
		if (!email || !name || !password || !cpassword || !isAdm) {
			return res.status(400).json({
				message: 'Fill all the fields',
			});
		}
		if (isAdm != 'true') {
			console.log('user');
			if (await UserModel.findOne({ email: email }))
				return res.status(400).json({
					message: 'Account with this email already exists',
				});

			if (password.length < 7) {
				return res.status(400).json({
					message: 'Password too short',
				});
			}

			if (password !== cpassword) {
				return res.status(400).json({
					message: 'Password and confirm password do not match',
				});
			}
			let newUser;

			const hashed_password = await bcrypt.hashSync(
				password,
				bcrypt.genSaltSync(parseInt(process.env.SALTROUNDS))
			);

			newUser = await UserModel.create({
				name: name,
				email: email,
				password: hashed_password,
			});
			if (newUser) {
				const token = await createUserJWT(newUser);
				return res.status(200).json({
					message: 'Success',
					token,
				});
			}
		} else {
			if (await AdminModel.findOne({ email: email }))
				return res.status(400).json({
					message: 'Account with this email already exists',
				});

			if (password.length < 7) {
				return res.status(400).json({
					message: 'Password too short',
				});
			}

			if (password !== cpassword) {
				return res.status(400).json({
					message: 'Password and confirm password do not match',
				});
			}

			let newUser;

			const hashed_password = await bcrypt.hashSync(
				password,
				bcrypt.genSaltSync(parseInt(process.env.SALTROUNDS))
			);

			newUser = await AdminModel.create({
				name: name,
				email: email,
				password: hashed_password,
			});
			if (newUser) {
				const token = await createAdminJWT(newUser);
				return res.status(200).json({
					message: 'Success',
					token,
				});
			}
		}
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later',
		});
	}
});

module.exports = AuthRouter;
