import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dad4c8nxn',
  api_key: process.env.CLOUDINARY_API_KEY || '488984445468973',
  api_secret: process.env.CLOUDINARY_API_SECRET || '3F1hb6zgO8SLBlrgb0hpU-4fOOg'
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(buffer);
      });

      uploadPromises.push(uploadPromise);
    }

    const results = await Promise.all(uploadPromises);
    console.log('Upload successful:', results);

    return Response.json(
      results.length === 1 ? results[0] : results
    );
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { status: 500 }
    );
  }
}