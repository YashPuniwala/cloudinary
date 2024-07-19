"use client";

import ImageUpload from "@/app/components/imageUpload";
import VideoUpload from "@/app/components/videoUpload";
import { addProduct } from "@/lib/action";
import { IProduct } from "@/lib/models";
import { CldUploadButton, CldVideoPlayer, CloudinaryUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ImageData {
  imageUrl: string;
  publicId: string;
}

interface VideoData {
  videoUrl: string;
  publicId: string;
}

const AddProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState("");
  const [imageUrl, setImageUrl] = useState<ImageData[]>([]);
  const [videoUrl, setVideoUrl] = useState<VideoData[]>([]);
  const [publicId, setPublicId] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSubmit = new FormData(e.currentTarget);
    imageUrl.forEach((img) => {
      formDataToSubmit.append("images", JSON.stringify(img));
    });
    videoUrl.forEach((vid) => {
      formDataToSubmit.append("videos", JSON.stringify(vid));
    });
    try {
      await addProduct(formDataToSubmit);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    console.log("result: ", result);
    const info = result.info as object;

    if ("secure_url" in info && "public_id" in info) {
      const url = info.secure_url as string;
      const public_id = info.public_id as string;
      setImageUrl((prevImageUrls) => [
        ...prevImageUrls,
        { imageUrl: url, publicId: public_id },
      ]);
    }
  };

  const handleVideoUpload = (result: CloudinaryUploadWidgetResults) => {
    console.log("result: ", result);
    const info = result.info as object;
    if ("secure_url" in info && "public_id" in info) {
      const url = info.secure_url as string;
      const public_id = info.public_id as string;
      setVideoUrl((prevVideoUrls) => [
        ...prevVideoUrls,
        { videoUrl: url, publicId: public_id },
      ]);
    }
  };

  const handleRemove = (publicIdToRemove: string) => {
    setImageUrl((prevImageUrl) =>
      prevImageUrl.filter((img) => img.publicId !== publicIdToRemove)
    );
  };

  const handleRemoveVideo = (publicIdToRemove: string) => {
    setVideoUrl((prevVideoUrl) =>
      prevVideoUrl.filter((vid) => vid.publicId !== publicIdToRemove)
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="title" placeholder="Title" />
        <label>Description</label>
        <input type="text" name="description" placeholder="Description" />
        <label>Price</label>
        <input type="number" name="price" placeholder="Price" />

        <div>
          <ImageUpload
            uploadPreset="xw6acwub"
            onImageUpload={handleImageUpload}
            imageUrl={imageUrl}
            onRemoveImage={handleRemove}
          />
          <VideoUpload
            uploadPreset="xw6acwub"
            onVideoUpload={handleVideoUpload}
            videoUrl={videoUrl}
            onRemoveVideo={handleRemoveVideo}
          />
        </div>
        <div>
          <button>Create Product</button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
