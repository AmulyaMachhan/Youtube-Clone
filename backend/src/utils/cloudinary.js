import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //File has been successufully uploaded on cloudinary
    console.log(`File is uploaded on cloudinary ${response.url}`);

    //File has been removed from the local storage
    fs.unlinkSync(localFilePath);

    return response;
  } catch (err) {
    fs.unlinkSync(localFilePath);

    console.log(`Cloudinary upload error ${err}`);

    return null;
  }
};
