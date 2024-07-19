"use client"

import { IProduct } from "@/lib/models";
import { connectToDB } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ImageData {
  imageUrl: string;
  publicId: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("https://cloudinary-mu.vercel.app/api/products", {
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
      const res = await fetch("https://cloudinary-mu.vercel.app/api/removeImage", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ publicId: publicIdToRemove, productId, mediaId, type }),
      });
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
                    removeMedia(image.publicId, product._id, image._id, "image", e)
                  }
                >
                  Remove Media From Cloudinary
                </button>
              </div>
            ))}
            {product.videos.map((video) => (
              <div key={video._id}>
                <video src={video.videoUrl} controls width="300" height="200" />
                <button
                  onClick={(e) =>
                    removeMedia(video.publicId, product._id, video._id, "video", e)
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
  );
};

export default ProductPage;