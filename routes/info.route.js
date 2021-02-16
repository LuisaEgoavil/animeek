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
          //console.log(anime)
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
            id: anime.mal_id,
            title: title,
            synopsis: synopsis,
            episodes: episodes,
            score: score
          }
          animeOptions.push(newAnime)
        })
        //saving our anime in the session to use it in future
        req.session.animeOptions = animeOptions

        res.render('search', {animeOptions})
    })
    .catch(function (error) {
	      console.error(error);
    });
})

//---------------------------------------------------------------
// PASSING INFORMATION TO THE DB

router.post('/search/create/:animeid', (req, res) => {

   let animeid = req.params.animeid 
   console.log('our anime id ', animeid)

  // all our animes are present in req.session.animeOptions
  // the user anime id is present in `animeid`
  let ourAnime = {}
  for (let i=0; i< req.session.animeOptions.length; i++) {
      let singleAnime = req.session.animeOptions[i]
      if (singleAnime.id == animeid) {
        ourAnime = singleAnime;
        break;
      }
  }

  //console.log('Anime', ourAnime)
  const {img, id, title, synopsis, episodes, score} = ourAnime
   let myNewAnimeObj = {
    title,
    image_url: img,
    synopsis,
    episodes,
    score,
    animeid: id,
    myUserId: req.session.userData._id
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
//DELETE REQUEST

router.post('/search/:animeid/delete', (req, res, next) => {
  let animeid = req.params.animeid

  AnimeModel.findByIdAndDelete(animeid)
     .then(() => {
         res.redirect('/profile')
         console.log('deleted anime')
         //res.render('/profile')
     })
     .catch(()=> {
       console.log('error')
         console.log('Deleted failed!')
     })
})


//---------------------------------------------------------------
//EXPORT
module.exports = router;