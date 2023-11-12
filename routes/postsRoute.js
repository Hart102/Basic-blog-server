const express = require("express");
const router = express.Router();

// Controllers
const {
  get_posts,
  create_posts,
  update_post,
} = require("../controllers/postsController");

// Routes
router.get("/", get_posts);
router.post("/create", create_posts);
router.put("/update", update_post);

module.exports = router;

// for Frontend use
// const Proxy = 'http://localhost:1000/server'
// const Proxy = 'https://learnedsblogapi.vercel.app/server'

// export default Proxy
