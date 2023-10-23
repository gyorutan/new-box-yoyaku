const router = require("express").Router();
const {
  createPost,
  getAllPosts,
  deletePost,
  checkingPosts
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getAllPosts);
router.delete("/delete/:id", deletePost);
router.post("/check" , checkingPosts)

module.exports = router;
