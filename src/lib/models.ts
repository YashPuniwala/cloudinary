import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the image schema
export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    images: IImage[];
    videos: IVideo[];
}

export interface IImage extends Document {
    imageUrl: string;
    publicId: string;
}

export interface IVideo extends Document {
    videoUrl: string;
    publicId: string;
}

const imageSchema: Schema<IImage> = new mongoose.Schema({
    imageUrl: {
        type: String,
        // required: true
    },
    publicId: {
        type: String,
        // required: true
    }
});

const videoSchema: Schema<IVideo> = new mongoose.Schema({
    videoUrl: {
        type: String,
        // required: true
    },
    publicId: {
        type: String,
        // required: true
    }
});

const productSchema: Schema<IProduct> = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    images: [imageSchema], // Embed an array of image schemas
    videos: [videoSchema], // Embed an array of image schemas
});

// Create the Product model
export const Product = mongoose.models?.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;