"use server"

import { revalidatePath } from "next/cache";
import Product from "./models";
import { connectToDB } from "./utils";

export const addProduct = async (formData: FormData) => {
    const { title, description, price } = Object.fromEntries(formData);
    const images = formData
      .getAll("images")
      .flatMap((entry: FormDataEntryValue) =>
        typeof entry === "string" ? JSON.parse(entry) : []
      );
    const videos = formData
      .getAll("videos")
      .flatMap((entry: FormDataEntryValue) =>
        typeof entry === "string" ? JSON.parse(entry) : []
      );
  
    try {
      connectToDB();
      const newProduct = new Product({ title, description, price, images, videos });
      await newProduct.save();
      revalidatePath("/products");
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create product");
    }
  };