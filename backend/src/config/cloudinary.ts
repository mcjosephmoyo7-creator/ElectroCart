import { v2 as cloudinary } from 'cloudinary';

const isPlaceholder =
  !process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME === 'placeholder';

if (isPlaceholder) {
  console.warn('Cloudinary credentials are placeholders. Image uploads will use fallback URLs.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
