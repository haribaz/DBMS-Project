const multer = require('multer');
const path = require('path');
const { v4 } = require('uuid');

const storage = multer.diskStorage({
	destination(_req, _file, cb) {
		cb(null, './images');
	},
	filename(_req, file, cb) {
		cb(null, v4() + path.extname(file.originalname));
	},
});

const uploadImg = multer({
	storage: storage,
	limits: { fileSize: 5000000 }, // 5MB
	fileFilter(_req, file, cb) {
		const filetypes = ['image/jpeg', 'image/png'];
		const mimetype = filetypes.includes(file.mimetype);
		if (mimetype) {
			return cb(null, true);
		}
		return cb(`Only jpg/jpeg/png files allowed!`);
	},
});

module.exports = { uploadImg };
