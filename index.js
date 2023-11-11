const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;

// Util
const { ImageUploader } = require("./util/index");

// Controllers
const Posts = require("./controllers/posts/index");

// Middlewares
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.post("/api/createpost", ImageUploader.single("file"), Posts.createPost);

app.listen(port, () => console.log(`App running on port ${port}`));
