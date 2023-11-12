const appwriteSDK = require("node-appwrite");
const { ImgIdGenerator, storage, bucketId } = require("../util/fileUploader");
const { connection } = require("../util/DBconnection/index");

// Get all Existing Blog Posts
const get_posts = (req, res) => {
  try {
    const sql = "SELECT * FROM `blog_posts`";
    connection.query(sql, (err, response) => {
      if (err) return res.json({ error: err });
      res.json({ success: response });
    });
  } catch (error) {
    res.json({ error: "Server Error" });
  }
};

// Create New Blog Posts
const create_posts = (req, res) => {
  try {
    if (req.file) {
      const Img = req.file;
      const { title, text } = req.body;

      // Upload Image to appwrite
      const promise = storage.createFile(
        bucketId,
        ImgIdGenerator(Img),
        appwriteSDK.InputFile.fromBuffer(Img.buffer, Img.originalname)
      );

      promise.then((response) => {
        if (response) {
          // Perfom database operation
          const sql =
            "INSERT INTO `blog_posts`(`imgId`, `title`, `text`) VALUES (?, ?, ?)";
          connection.query(sql, [response.$id, title, text], (err) => {
            if (err)
              return res.json({
                error: "post not published, please try again.",
              });
            res.json({ success: "post published" });
          });
        }
      });
    }
  } catch (error) {
    res.json({ error: "Server Error" });
  }
};

// Update Post
const update_post = (req, res) => {
  try {
    const Img = req.file ? req.file : "";
    const { id, imgId, title, text } = req.body;

    const isPreviousImg = ImgIdGenerator(Img) == imgId ? true : false;
    // res.json(isPreviousImg);

    // If new image is not the same as the previous image, delete image
    if (!isPreviousImg) {
      storage.deleteFile(bucketId, `${imgId}`);
      // const appwriteImages = storage.listFiles(bucketId);
      // if (appwriteImages) res.json(appwriteImages);
    }

    // if (Img || req.body) {
    //   // If new image is not the same as the previous image, replace image
    //   if (isNewImage) {
    //     const promise = storage.createFile(
    //       bucketId,
    //       ImgIdGenerator(Img),
    //       appwriteSDK.InputFile.fromBuffer(Img.buffer, Img.originalname)
    //     );
    //   }
    // }
  } catch (error) {
    res.json({ error: "Server Error" });
  }
};

module.exports = { get_posts, create_posts, update_post };

//  "$id": "Screenshotfrompng",
//     "bucketId": "654eebaf29a4647e9656",
//     "$createdAt": "2023-11-11T03:37:57.143+00:00",
//     "$updatedAt": "2023-11-11T03:37:57.143+00:00",
//     "$permissions": [],
//     "name": "Screenshot from 2023-10-30 11-50-41.png",
//     "signature": "0ec9aa12929f1b616bbf01778818f0e3",
//     "mimeType": "image/png",
//     "sizeOriginal": 140701,
//     "chunksTotal": 1,
//     "chunksUploaded": 1

// INSERT INTO `blog_posts`(`id`, `imgId`, `title`, `text`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]')
