import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config()

console.log('Multer config loaded')

interface Params {
    folder: string;
    format?: (req: any, file: any) => string;
    public_id?: (req: any, file: any) => string;
  }

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (_req: any, _file: any) => 'png',
        public_id: (_req: any, file: { originalname: any; }) => file.originalname,
    } as unknown as Params,
});
  const multerUploads = multer({storage:storage})

  export default multerUploads;