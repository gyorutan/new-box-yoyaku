const router = require("express").Router();
const {
  createPost,
  getAllPosts,
  deletePost,
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getAllPosts);
router.delete("/delete/:id", deletePost);

module.exports = router;
