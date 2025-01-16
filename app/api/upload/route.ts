import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const runtime = 'nodejs'; // Add this line
export const dynamic = 'force-dynamic'; // Add this line
// Remove the old config export

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file');
    const uploadPromises = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'greenhub',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'png', 'gif', 'webp'], // Add allowed formats
            max_bytes: 10485760, // 10MB limit
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(buffer);
      });

      uploadPromises.push(uploadPromise);
    }

    const results = await Promise.all(uploadPromises);
    return Response.json(results.length === 1 ? results[0] : results);
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`Upload failed: ${errorMessage}`, { status: 500 });
  }
}