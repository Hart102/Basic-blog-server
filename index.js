const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;

// Routes
const postRoutes = require("./routes/postsRoute");

// Util
const { ImageUploader } = require("./util/fileUploader");

// Middlewares
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/blog", ImageUploader.single("file"), postRoutes) // Posts Route

app.listen(port, () => console.log(`App running on port ${port}`));
