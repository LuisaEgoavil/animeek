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

//GO TO THE SEARCH PAGE

router.get('/add', (req, res)=> {
  res.render('search.hbs')
})

//--------------------------------------------------------------
//FROM SEARCH TO PROFILE

router.get('/profile', (req,res) => {
  res.render('profile.hbs')
})

//--------------------------------------------------------------

router.post('/search', (req, res) => {
  
  //GRAB THE CODE FROM JIKAN
let searchAnime = req.body 
  
const axios = require("axios").default;

let options = {
  method: 'GET',
  url: 'https://jikan1.p.rapidapi.com/search/anime',
  params: {q: searchAnime },
  headers: {
    'x-rapidapi-key': 'a15b028483mshd7de36fe4ec3c86p1dd3adjsnc9a9d91ca457',
    'x-rapidapi-host': 'jikan1.p.rapidapi.com'
  }
};

axios.request(options)
    .then(function (response) {
	      console.log(response.data.results[0].title);
        //CLOSE THE CONNECTION HERE?
        //mongoose.connection.close()
    })
    .catch(function (error) {
	      console.error(error);
         //CLOSE THE CONNECTION HERE?
         //mongoose.connection.close()
    });
})

//---------------------------------------------------------------


 






//EXPORT
module.exports = router;