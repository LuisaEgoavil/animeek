const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {title: 'Welcome to Animeek!'});
});





module.exports = router;
