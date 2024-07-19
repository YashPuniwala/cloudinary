"use client";

import ImageUpload from "@/app/components/imageUpload";
import VideoUpload from "@/app/components/videoUpload";
import { addProduct } from "@/lib/action";
import { IProduct } from "@/lib/models";
import {
  CldUploadButton,
  CldVideoPlayer,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
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
      handleNewPost()
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

  const fetchProducts = async () => {
    const res = await fetch("https://cloudinary-jade.vercel.app/api/products", {
      next: { revalidate: 3600 },
    });
    try {
      if (!res.ok) {
        throw new Error("Something went wrong");
      } else {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewPost = () => {
    fetchProducts();
  };

  useEffect(() => {
    
    fetchProducts();
  }, []);

  const removeMedia = async (
    publicIdToRemove: string,
    productId: string,
    mediaId: string,
    type: "image" | "video",
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://cloudinary-jade.vercel.app/api/removeImage",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            publicId: publicIdToRemove,
            productId,
            mediaId,
            type,
          }),
        }
      );
      if (res.ok) {
        // Update the products state with the updated products from the API
        const updatedProducts = await res.json();
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.log(error);
    }
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

      <div>
        {products.map((product) => (
          <div key={product._id}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <div>
              {product.images.map((image) => (
                <div key={image._id}>
                  <Image
                    src={image.imageUrl}
                    width={300}
                    height={200}
                    alt={product.title}
                  />
                  <button
                    onClick={(e) =>
                      removeMedia(
                        image.publicId,
                        product._id,
                        image._id,
                        "image",
                        e
                      )
                    }
                  >
                    Remove Media From Cloudinary
                  </button>
                </div>
              ))}
              {product.videos.map((video) => (
                <div key={video._id}>
                  <video
                    src={video.videoUrl}
                    controls
                    width="300"
                    height="200"
                  />
                  <button
                    onClick={(e) =>
                      removeMedia(
                        video.publicId,
                        product._id,
                        video._id,
                        "video",
                        e
                      )
                    }
                  >
                    Remove Media From Cloudinary
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProducts;
