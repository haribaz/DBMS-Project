const AuthRouter = require('express').Router();
const bcrypt = require('bcrypt');

require('dotenv').config({ path: '../../env/.env' });
const UserModel = require('../../database/models/user');
const AdminModel = require('../../database/models/admin');

const { createUserJWT, createAdminJWT } = require('../../middleware/jwt');

AuthRouter.get('/login', async (req, res) => {
	res.render('login', { layout: 'layouts/login' });
});

AuthRouter.post('/login', async (req, res) => {
	try {
		const { email, password, isAdm } = req.body;
		// console.log(req.body);
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
					res.cookie('token', token);
					return res.redirect('/api/user/movie/home');
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
					res.cookie('token', token);
					return res.redirect('/api/admin/movie/all');
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

AuthRouter.get('/register', async (req, res) => {
	res.render('register', { layout: 'layouts/login' });
});

AuthRouter.post('/register', async (req, res) => {
	try {
		console.log(req.body);
		const { email, name, password, cpassword, isAdm } = req.body;
		if (!email || !name || !password || !cpassword || !isAdm) {
			return res.status(400).json({
				message: 'Fill all the fields',
			});
		}
		if (isAdm != 'true') {
			// console.log('user');
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
				res.cookie('token', token);
				return res.redirect('/api/user/movie/home');
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
				res.cookie('token', token);
				return res.redirect('/api/admin/movie/all');
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
