import Product from "@/lib/models";
import { connectToDB } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDB();
        const products = await Product.find();
        return NextResponse.json(products);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch products!");
    }
};

export const POST = async (req: Request) => {
    const { title, description, price, images } = await req.json();

    if (!title || !description || !price || !images) {
        return NextResponse.json(
            { error: "Title, description, price, and images are required." },
            { status: 400 }
        );
    }

    try {
        await connectToDB();

        const newProduct = new Product({
            title,
            description,
            price,
            images: images.map((image: any) => ({
                imageUrl: image.imageUrl,
                publicId: image.publicId
            }))
        });

        await newProduct.save();
        console.log("Post created");

        revalidatePath("/products");
        return NextResponse.json(newProduct);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to create product");
    }
}