const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')
const AnimeModel = require('../models/Anime.model')

//GET LOG IN PAGE
router.get('/login', (req, res, next) => {
  res.render('auth/login.hbs')
});

//--------------------------------------------------------------
//GET SIGN UP PAGE
router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs')
});


//--------------------------------------------------------------
//POST REQUEST TO SIGNUP
router.post('/signup', (req, res, next) => {
  const {name, email, password} = req.body

  //VALIDATE SIGNUP & CHECK IF USER ENTERED ALL THREE FIELDS
  if(!name.length || !email.length || !password.length) {
    res.render('auth/signup', {msg: 'Incomplete. Please enter all fields'})
    return;
  }

  //VALIDATE THE RIGHT FORMAT OF THE EMAIL
  let re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
        res.render('auth/signup', {msg: 'Email not in valid format'})
        return;
    }

  //VALIDATE PASSWWORD (CHARACTERS AND SO)
  /*let regexPass = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;
    if (!regexPass.test(password)) {
        res.render('auth/signup', {msg: 'Password needs to have special chanracters, some numbers and be 6 characters aatleast'})
        return;
    }*/

  //CREATE A SALT (ENCRYPT PASSWORD)
  let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    UserModel.create({name, email, password: hash})
        .then(() => {
            res.redirect('/login') //
        })
        .catch((err) => {
            next(err)
        })

})

//--------------------------------------------------------------
//POST REQUEST FOR LOG IN
router.post('/login', (req, res, next) => {
  const {email, password} = req.body

  UserModel.findOne({email: email})
      .then((result) => {

        //IF THE USER EXISTS
        if(result) {

          bcrypt.compare(password, result.password)
              .then((isMatching) => {
                  if(isMatching) {
                    req.session.userData = result
                    req.session.areyoutired = false
                    res.redirect('/profile')
                  }
                  else{
                    res.render('auth/login.hbs', {msg: 'Incorrect password 🔑'})
                  }
              })
        }
        else {
          res.render('auth/login.hbs', {msg: 'Sorry, this email does not exist 📧'})
        }
      })
      .catch((err)=>{
        next(err)
      })
})

//--------------------------------------------------------------
//MIDDLEWARE TO PROTECTS ROUTES
const checkLoggedInUser = (req, res, next) => {
  if(req.session.userData) {
    next()
  }
  else {
    res.redirect('/login')
  }
}

//--------------------------------------------------------------
//GUET REQUEST TO HANDLE THE PROFILE
router.get('/profile', checkLoggedInUser, (req, res, next) => {
  let name = req.session.userData.name
  let id = req.session.userData._id
  
  
  //this will give us the selected animes in the profile
  AnimeModel.find({myUserId: id})
    .then((result) =>{
      //console.log('animeid', result)
      res.render('profile.hbs', {result, name})
    })
    .catch((err) => {
      next(err)
})
})

router.post('/profile/:animeid/delete', (req, res, next) => {
  let animeid = req.params.animeid

  AnimeModel.findByIdAndDelete(animeid)
    .then(() => {
        res.redirect('/profile')
         //console.log('deleted anime')
    })
    .catch(()=> {
        console.log('error')
         //console.log('Deleted failed!')
    })
})

//--------------------------------------------------------------
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

//GO TO ABOUT PAGE
router.get("/about", (req, res, next)=>{
  res.render("about")
})

router.get("/aboutus", (req, res, next)=>{
  res.render("aboutus")
})



//EXPORT
module.exports = router;