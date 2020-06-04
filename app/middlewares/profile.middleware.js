const multer = require('multer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const logger = require('tracer').colorConsole();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/jpg'
  ) {
    return callback(null, true);
  }
  req.fileValidationError = true;
  return callback(null, false);
};

const storage = multer.diskStorage({

  destination: (req, file, callback) => {
    const { userId } = req.user;
    const folder = `./uploads/${userId}`;

    if (!fs.existsSync(folder)) {
      logger.info('making folder');
      mkdirp.sync(folder);
    }

    callback(null, folder);
  },
  filename: (req, file, callback) => {
    const name = 'ProfilePic';
    const ext = MIME_TYPE_MAP[file.mimetype];
    const filename = `${name}-${Date.now()}.${ext}`;
    callback(null, filename);
  },
});


module.exports = multer({ storage, fileFilter });
