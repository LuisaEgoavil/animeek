const router = require('express').Router();

const AnimeModel = require('../models/Anime.model.js')

const axios = require('axios')

router.get('/animeinfo', (req, res, next) => {

  AnimeModel.find()
     .then((title)=> {
       res.render('title', {title})
       console.log(title)
     })
     .catch((error)=> {
       next(error)
     })
});


module.exports = router;