require("dotenv").config();
const cloudinary = require("cloudinary").v2;

/**
 * Setting cloudinary
 */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

cloudinaryUpload = (file, folderName, fileName) =>
    cloudinary.uploader.upload(file, {
        upload_preset: process.env.UPLOAD_PRESET,
        public_id: fileName,
        folder: folderName
    });

/**
 * Get images from folder using cloudinary Search API
 */
getImages = async (next_cursor, folderName) => {
    const resources = await cloudinary.search
        .expression(`folder:${folderName}`)
        .max_results(20)
        .sort_by("uploaded_at", "desc")
        .next_cursor(next_cursor)
        .execute();
    return resources;
};

/**
 * Delete images from folder using cloudinary Search API
 */
deleteImagesById = async (public_ids) => {
    return await cloudinary.api.delete_resources(public_ids);
};

module.exports = {
    cloudinaryUpload,
    getImages,
    deleteImagesById
};
