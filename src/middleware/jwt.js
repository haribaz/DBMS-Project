const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../env/.env' });

const createUserJWT = async (user) => {
	if (user.email && user._id)
		return jwt.sign(
			{
				email: user.email,
				id: user._id,
				isAdmin: false,
			},
			process.env.TOKEN_KEY
		);
	{
		expiresIn: '168h';
	}
};

const createAdminJWT = async (user) => {
	if (user.email && user._id)
		return jwt.sign(
			{
				email: user.email,
				id: user._id,
				isAdmin: true,
			},
			process.env.TOKEN_KEY
		);
	{
		expiresIn: '168h';
	}
};

const verifyUserJWT = (req, res, next) => {
	try {
		const { token } = req.headers;
		if (!token) {
			return res.status(401).json({ message: ' No token' });
		}

		jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
			req.jwt_payload = decoded;
			if (err) {
				console.log('error', err.message);
				return res
					.status(403)
					.json({ message: 'Invalid token or Token expired' });
			}

			if (isNaN(decoded.email) && decoded.isAdmin)
				return res.status(400).json({ message: 'Invalid token' });
			return next();
		});

		return null;
	} catch (err) {
		console.log('error', err.message);
		res.status(500).json({ message: 'Server Error. Try agin later' });
	}
};

const verifyAdminJWT = (req, res, next) => {
	try {
		const { token } = req.headers;
		if (!token) {
			return res.status(401).json({ message: ' No token' });
		}

		jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
			req.jwt_payload = decoded;
			if (err) {
				console.log('error', err.message);
				return res
					.status(403)
					.json({ message: 'Invalid token or Token expired' });
			}

			if (isNaN(decoded.email) && !decoded.isAdmin)
				return res.status(400).json({ message: 'Invalid token' });
			return next();
		});

		return null;
	} catch (err) {
		console.log('error', err.message);
		res.status(500).json({ message: 'Server Error. Try agin later' });
	}
};

module.exports = {
	createUserJWT,
	createAdminJWT,
	verifyUserJWT,
	verifyAdminJWT,
};
