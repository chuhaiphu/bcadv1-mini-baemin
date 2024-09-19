import { v2 as cloudinary } from 'cloudinary'

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config(process.env.CLOUDINARY_URL)
  }
}