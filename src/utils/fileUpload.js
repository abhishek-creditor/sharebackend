const multer = require("multer");

// Upload image File using multer
var storageUserProfileFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../uploads/userProfile`)
  },
  filename: function (req, file, callback) {
    console.log(file);
    
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

// Upload image using multer
const userProfileUpload = multer({
  storage: storageUserProfileFile,
  limits: {
    fileSize: "5000000",
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(
        new Error(
          "Please upload document in png,jpg,jpeg file format"
        )
      );
    }
    cb(undefined, true);
  },
});

module.exports = {
   userProfileUpload
};
