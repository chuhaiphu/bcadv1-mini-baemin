import { UploadApiErrorResponse, UploadApiResponse, DeleteApiResponse } from 'cloudinary'

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse | DeleteApiResponse
