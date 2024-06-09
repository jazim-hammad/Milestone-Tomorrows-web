const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadSingle = upload.single("file");

  uploadSingle(req, res, function (err) {
    if (err || !req.file) {
      return res.status(500).json({ error: err || "No file uploaded" });
    }
    // Typically, you'd want to move the file to permanent storage here
    res.json({ filePath: req.file.path });
  });
};
