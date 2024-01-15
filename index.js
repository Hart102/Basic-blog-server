const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 9000;

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
      // secure: false,
      secure: process.env.NODE_ENV || "production",
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // 'strict'
      // sameSite: true, // 'strict'
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

// app.get("/api/posts", (req, res) => {
//   res.json("Get all posts");
// });

// app.get("/api/posts/create", (req, res) => {
//   res.json("Create post route");
// });

// app.get("/api/posts/edit", (req, res) => {
//   res.json("Edit post route");
// });

// app.use("/blog", ImageUploader.single("file"), postRoutes); // Posts Route

// app.get("/api/posts", (req, res) => {
//   res.json("POST ROUTES");
// });
app.use("/api/posts", postRoutes); // Posts Route
app.use("/api/user", authRoutes);

app.listen(port, () => console.log(`App running on port ${port}`));