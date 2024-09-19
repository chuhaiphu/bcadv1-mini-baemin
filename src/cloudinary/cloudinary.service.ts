import { ConflictException, Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryResponse } from './cloudinary.response'
import * as streamifier from 'streamifier'

@Injectable()
export class CloudinaryService {
  async fileExists(filename: string, folder: string): Promise<boolean> {
    const result = await cloudinary.search
      .expression(`folder:${folder} AND filename:${filename}`)
      .execute()
    return result.total_count > 0
  }

  async uploadFile(file: Express.Multer.File, folder: string, filename?: string): Promise<CloudinaryResponse> {
    if (filename && await this.fileExists(filename, folder)) {
      throw new ConflictException('File with this name already exists')
    }

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadOptions: any = { folder: folder }
      if (filename) {
        uploadOptions.public_id = filename;
      }
  
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result)
        },
      )
  
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    })
  }
  
  deleteFile(publicId: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error)
        resolve(result)
      })
    })
  }
}