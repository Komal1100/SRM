import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.FILE_UPLOAD_CLOUD_NAME,
    api_key: process.env.FILE_UPLOAD_API_KEY,
    api_secret: process.env.FILE_UPLOAD_API_SECRET
})


export async function uploadFileToCloudinary(
    file: File,
    folder: string = 'general'
): Promise<{ url: string; originalName: string } | null> {
    if (!file || file.size === 0) return null;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error || !result) reject(error);
                else {
                    resolve({
                        url: result.secure_url,
                        originalName: file.name,
                    });
                }
            }
        ).end(buffer);
    });
}

// export default cloudinary