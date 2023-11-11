const appwriteSDK = require("node-appwrite");
const { ImgIdGenerator, storage, bucketId } = require("../../util/index");
const { DB } = require("../../util/DBconnection/index");

const createPost = (req, res) => {
  try {
    if (req.file) {
      const Img = req.file;

      // Upload Image to appwrite
      const promise = storage.createFile(
        bucketId,
        ImgIdGenerator(Img),
        appwriteSDK.InputFile.fromBuffer(Img.buffer, Img.originalname)
      );

      promise
        .then((response) => {
          if (response) {
            // Perform Database operation
            res.json(response);
          }
        })
        .catch((err) => res.json(err));
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createPost };
