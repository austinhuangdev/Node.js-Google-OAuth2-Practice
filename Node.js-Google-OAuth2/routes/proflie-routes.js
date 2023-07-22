const router = require("express").Router();
const Post = require("../models/post-model");
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};

router.get("/", authCheck, async (req, res) => {
  let foundPost = await Post.find({ author: req.user._id });
  return res.render("profile", { user: req.user, posts: foundPost }); // deSerializeUser()
});

router.get("/post", authCheck, (req, res) => {
  return res.render("post", { user: req.user });
});

router.post("/post", authCheck, async (req, res) => {
  let { title, content } = req.body;
  let newPost = new Post({ title, content, author: req.user._id });
  try {
    await newPost.save();
    return res.redirect("/profile");
  } catch (err) {
    req.flash("error_msg", "標題與内容都需要填寫。");
    return res.redirect("/profile/post");
  }
});
module.exports = router;