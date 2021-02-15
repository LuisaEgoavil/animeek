const router = require('express').Router();
const AnimeModel = require('../models/Anime.model.js')
const axios = require('axios')


//--------------------------------------------------------------
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

//--------------------------------------------------------------

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
	      //console.log(response.data.results);
        let animeArr = response.data.results;
        //image_url, title, synopsis
        let animeOptions = []

        animeArr.forEach((anime) =>{
          
          let img = anime.image_url
          //console.log(anime.image_url)
          let title = anime.title
          //console.log(anime.title)
          let synopsis = anime.synopsis
          //console.log(anime.synopsis)
          let episodes = anime.episodes
          //console.log(anime.episodes)
          let score = anime.score
          //console.log(anime.score)

          let newAnime = {
            img: img,
            title: title,
            synopsis: synopsis,
            episodes: episodes,
            score: score
          }
          animeOptions.push(newAnime)
        })
        res.render('search', {animeOptions})
    })
    .catch(function (error) {
	      console.error(error);
    });
})

//---------------------------------------------------------------
//TRYING!!
router.post('/info/search/create', (req, res) => {
  
   const {addimg, addtitle, addepisodes, addscore, addsypnosis} = req.body
   let myNewAnimeObj = {
    title: addtitle,
    image_url: addimg,
    synopsis: addsypnosis,
    episodes: addepisodes,
    score: addscore
   }

   AnimeModel.create(myNewAnimeObj)
      .then(()=> {
        res.redirect('/profile')
          
      })
      .catch(()=> {
          console.log('Something went wrong while creating')
      })


})

//---------------------------------------------------------------
//EXPORT
module.exports = router;