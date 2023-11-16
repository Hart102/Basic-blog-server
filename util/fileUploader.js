const multer = require("multer");
const appwriteSDK = require("node-appwrite");

const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "2222";
const bucketId = "654eebaf29a4647e9656";
const apiKey =
  "aa14902d05d922c1579ec6fa2cfc5563ddc60db930785c97e3d056f4b6906760c961edac212df99c5144ec85a2ccdaffb5333c57c0cd2ae9e50de951d5623b6b022434ce0f3fdf9de18f91c00503591a5ae6232472c4d4036a26e617f7bddc9bfb2c5f8ae5ff087c6e56eed7b1d870484c467981473ad2fcd90d1e821c626a37";

// Initalize appwrite
const client = new appwriteSDK.Client();
const storage = new appwriteSDK.Storage(client);

// Authentication to get access to appwrite
client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

const Upload = multer.memoryStorage();
const ImageUploader = multer({ storage: Upload });

// Generate Id for images
const ImgIdGenerator = (imgObject) => {
  if (imgObject) {
    const ID =
      imgObject.originalname.replace(/[^a-z^A-Z]/g, "").length > 20
        ? imgObject.originalname.replace(/[^a-z^A-Z]/g, "").slice(0, 20)
        : imgObject.originalname.replace(/[^a-z^A-Z]/g, "");
    return ID;
  }
};

module.exports = { ImageUploader, storage, bucketId, ImgIdGenerator };
