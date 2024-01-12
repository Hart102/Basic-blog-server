const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const app = express();
const port = 5000;

const expDate = 60 * 60 * 1000 * 24; // 1 hour 1 day

app.use(
  session({
    name: "blog_site",
    secret: "123",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: expDate,
      secure: false,
      sameSite: true, // 'strict'
    },
  })
);

// Routes
const postRoutes = require("./routes/postsRoute");
const authRoutes = require("./routes/authRoutes");

// Util
const { ImageUploader } = require("./util/fileUploader");

// Middlewares
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.json("Welcome to my blog server");
});
app.use("/blog", ImageUploader.single("file"), postRoutes); // Posts Route
app.use("/blog", authRoutes);

app.listen(port, () => console.log(`App running on port ${port}`));