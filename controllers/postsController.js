const appwriteSDK = require("node-appwrite");
const {
  ImgIdGenerator,
  storage,
  bucketId,
  ImageUploader,
} = require("../util/fileUploader");
const { connection } = require("../util/DBconnection/index");
const upload = ImageUploader.single("file");

// Get all Existing Blog Posts
const get_posts = (req, res) => {
  try {
    return res.json("POST ROUTES");
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
    upload(req, res, () => {
      if (!req.file) return res.json({ error: "please choose image" });
      const Img = req.file;

      const newPost = (postObect, Img_Id) => {
        if (postObect) {
          const sql = `INSERT INTO blog_posts (title, text, category, imgId) VALUES (?, ?, ?, ?)`;

          connection.query(
            sql,
            [postObect.title, postObect.text, postObect.category, Img_Id],
            (err) => {
              if (err)
                return res.json({
                  error: "post not published, please try again.",
                });
              res.json({ success: "post published" });
            }
          );
        }
      };

      const uniqueId = Math.random();
      // Upload Image to appwrite
      const promise = storage.createFile(
        bucketId,
        ImgIdGenerator(Img) + uniqueId,
        appwriteSDK.InputFile.fromBuffer(Img.buffer, Img.originalname)
      );
      promise.then((response) => {
        if (response) {
          // Perfom database operation
          newPost(req.body, response.$id);
        }
      });
    });
    // }
  } catch (error) {
    res.json({ error: "Please chec your network connection" });
  }
};

// Update Blog Post
const update_post = (req, res) => {
  try {
    upload(req, res, () => {
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
            const sql = `UPDATE  blog_posts  SET title=?, text=?, category=?, imgId=? WHERE id="${postObjcet.id}"`;
            return connection.query(
              sql,
              [postObjcet.title, postObjcet.text, postObjcet.category, ImageId],
              (err) => {
                if (err)
                  return res.json({
                    error:
                      "post not updated. please check your newwork connection.",
                  });
                res.json({ success: "post updated" });
              }
            );
          }
        };

        // Update only text if the previous Image still exists
        if (!Img) return update_article(postObject.imgId, postObject);

        if (Img) {
          storage.deleteFile(bucketId, postObject.imgId); // Delete previous Image if a new image is provided

          setTimeout(() => {
            // Replace deleted image with a new image
            const promise = storage.createFile(
              bucketId,
              ImgIdGenerator(Img),
              appwriteSDK.InputFile.fromBuffer(Img.buffer, Img.originalname)
            );
            promise
              .then((response) => {
                // Update post with Image
                if (response) update_article(IMAGE_ID, postObject);
              })
              .catch((err) => res.json({ error: err }));
          }, 1000);
        }
      }
    });
  } catch (error) {
    res.json({ error: error });
  }
};

// Delete Blog Post
const delete_post = (req, res) => {
  try {
    if (req.body) {
      const { id, Img_Id } = req.body;

      // Delete image from appwrite
      if (Img_Id) {
        storage.deleteFile(bucketId, Img_Id);
      }

      // Delete post from database
      const sql = `DELETE FROM blog_posts WHERE id="${id}"`;
      connection.query(sql, (err) =>
        err
          ? res.json({ error: "post not deleted. please try again." })
          : res.json({ success: "post deleted" })
      );
    }
  } catch (error) {
    res.json({ error: "Please check your network connection" });
  }
};

module.exports = { get_posts, create_posts, update_post, delete_post };

