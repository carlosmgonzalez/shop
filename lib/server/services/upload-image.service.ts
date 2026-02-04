import cloudinary from "../cloudinary";

export interface UploadImageResult {
  url: string;
  publicId: string;
}

export async function uploadImage(
  file: File,
  folder: string
): Promise<UploadImageResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        transformation: [
          {
            width: 1000,
            height: 1000,
            crop: "fill",
          },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload failed: No result returned"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}
