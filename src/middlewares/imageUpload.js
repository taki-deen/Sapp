import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for general file uploads
const upload = multer({
  limits: {
    fileSize: 8000000, // Max file size in bytes (8000 KB)
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads"); // The directory to store images
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = Date.now(); // Generate a unique file name
      cb(null, `${uniqueName}${ext}`); // Set the file name
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["jpg", "jpeg", "png"];
    const fileExtension = file.mimetype.split("/")[1];

    // Check if the file type is allowed
    if (allowedFileTypes.includes(fileExtension)) {
      cb(null, true); // Accept the file
    } else {
      // cb(new Error("Invalid file type"), false); // Reject the file
    }
  },
});

// Configuration for uploading sheets
const sheetStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploaded sheets
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Set unique file name
  },
});



// Middleware for single image upload
const uploadImageMiddleware = (req, res, next) => {
  const uploadSingle = upload.single("image"); // 'image' is the field name in the form

  uploadSingle(req, res, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(400).json({
        error: err.message,
      });
    }
    next(); // Proceed to the next middleware if no error
  });
};

export { uploadImageMiddleware };
