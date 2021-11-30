const express = require('express');
const imageRouter = express.Router();

const path = require('path');
const fs = require('fs');

imageRouter.get('/', (req, res) => {
	try {
		const { photo } = req.query;

		if (!photo) {
			return res.status(400).json({
				message: 'query incomplete',
			});
		}

		const picDirectory = path.join(__dirname, '../../../images/');
		const picPath = path.join(picDirectory, photo);

		if (fs.existsSync(picPath)) {
			return res.status(200).sendFile(picPath);
		}
		return res
			.status(404)
			.json({ message: 'no such file exists in directory' });
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({
			message: 'Server Error, Try again later.',
		});
	}
});

module.exports = imageRouter;
