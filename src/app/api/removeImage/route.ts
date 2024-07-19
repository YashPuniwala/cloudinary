import cloudinary from "cloudinary";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/utils";
import Product from "@/lib/models";
import { revalidatePath } from "next/cache";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const removeMedia = async (publicId: string, productId: string, mediaId: string, type: "image" | "video") => {
  try {
    console.log(publicId, "publicId");

    // Remove the image/video from Cloudinary
    const result = await cloudinary.v2.uploader.destroy(publicId, { resource_type: type === 'image' ? 'image' : 'video' });
    console.log(`${type} removed from Cloudinary`, result);

    if (result.result === 'not found') {
      throw new Error(`${type} not found in Cloudinary with publicId: ${publicId}`);
    }

    // Connect to the database
    await connectToDB();

    // Find the product and update its images/videos array by removing the image/video with the given publicId
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $pull: {
          [type === 'image' ? 'images' : 'videos']: { _id: mediaId }
        }
      },
      { new: true }
    );
    console.log(product, `deleted ${type}`);
    console.log(`${type} removed from the database`);

    revalidatePath("/products");
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
  }
};

export async function POST(req: Request) {
  const { publicId, productId, mediaId, type } = await req.json();
  await removeMedia(publicId, productId, mediaId, type);

  // Fetch updated products from the database and return
  const updatedProducts = await Product.find();
  return NextResponse.json(updatedProducts);
}