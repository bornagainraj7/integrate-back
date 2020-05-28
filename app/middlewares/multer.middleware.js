const multer = require('multer');
const fs = require('fs');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'application/pdf': 'pdf',
};

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'application/pdf'
  ) {
    return callback(null, true);
  }
  req.fileValidationError = true;
  return callback(null, false);
};

const storage = multer.diskStorage({

  destination: (req, file, callback) => {
    const { userId } = req.user;
    const { leadId } = req.params;
    const folder = `./uploads/lead_documents/${userId}/${leadId}`;
    // const isValid = MIME_TYPE_MAP[file.mimetype];
    // let error = new Error('Invalid file type');
    // if (isValid) {
    //   error = null;
    // }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync('./uploads');
      fs.mkdirSync('./uploads/lead_documents');
      fs.mkdirSync(`./uploads/lead_documents/${userId}`);
      fs.mkdirSync(folder);
    }

    callback(null, folder);
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    const filename = `${name}-${Date.now()}.${ext}`;
    callback(null, filename);
  },
});


module.exports = multer({ storage, fileFilter });
