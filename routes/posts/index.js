// import express from "express";
const express = require("express");
const router = express.Router();
const { createPost } = require("../../controllers/posts/index");

router.post("/", createPost);

module.exports = { router };

// import express from "express";
// import {
//   addPost,
//   deletePost,
//   getPost,
//   getPosts,
//   updatePost,
//   updatePostLikes,
// } from "../controllers/post.js";
// const router = express.Router();

// router.get("/", getPosts);
// router.get("/:id", getPost);
// router.post("/", addPost);
// router.delete("/:id", deletePost);
// router.put("/:id", updatePost);
// router.put("/likes/:id", updatePostLikes);

// export default router;

// for Frontend use
// const Proxy = 'http://localhost:1000/server'
// const Proxy = 'https://learnedsblogapi.vercel.app/server'

// export default Proxy
