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

// Update Blog Post
const update_post = (req, res) => {
  try {
    if (req.body || req.file) {
      const postObject = req.body;
      const Img = req.file ? req.file : "";

      // If New image, get new image Id, else get previous image Id
      const IMAGE_ID =
        postObject.Img_Id == ImgIdGenerator(Img)
          ? postObject.Img_Id
          : ImgIdGenerator(Img);

      // Reused
      const update_article = (ImageId, postObjcet) => {
        if (postObjcet) {
          const sql = `UPDATE blog_posts SET imgId = ?, title = ?, text = ? WHERE id = "${postObjcet.id}"`;
          return connection.query(
            sql,
            [ImageId, postObjcet.title, postObjcet.text],
            (err) => {
              if (err)
                return res.json({
                  error: "post not updated. please try again.",
                });
              res.json({ success: "post updated" });
            }
          );
        }
      };

      // Update only text if the previous Image still exists
      if (postObject.Img_Id == ImgIdGenerator(Img))
        return update_article(IMAGE_ID, postObject);

      // Update both text and image if a new image is provided
      if (Img && postObject.Img_Id !== ImgIdGenerator(Img)) {
        storage.deleteFile(bucketId, postObject.Img_Id); // Delete previous Image if a new image is provided

        setTimeout(() => {
          // Replace deleted image with a new image
          const promise = storage.createFile(
            bucketId,
            ImgIdGenerator(Img),
            appwriteSDK.InputFile.fromBuffer(Img.buffer, Img.originalname)
          );
          promise
            .then((response) => {
              if (response) update_article(IMAGE_ID, postObject); // Perform Database operation
            })
            .catch((err) =>
              res.json({ error: "post not updated. please try again." })
            );
        }, 1000);
      }
    }
  } catch (error) {
    res.json({ error: "Server Error" });
  }
};

// Delete Blog Post
const delete_post = (req, res) => {
  try {
    if (req.body) {
      const { id, Img_Id } = req.body;

      // Delete image from appwrite
      storage.deleteFile(bucketId, Img_Id);

      // Delete post from database
      const sql = `DELETE FROM blog_posts WHERE id="${id}"`;
      connection.query(sql, (err, response) =>
        err
          ? res.json({ error: "post not deleted. please try again." })
          : res.json({ success: "post deleted" })
      );
    }
  } catch (error) {
    res.json({ error: "Server Error" });
  }
};

module.exports = { get_posts, create_posts, update_post, delete_post };

