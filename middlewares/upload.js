import multer from 'multer';
import path from 'path';

const tempDir = path.resolve('temp');

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    callback(null, uniqueSuffix);
  },
});

const upload = multer({storage});

export default upload;
