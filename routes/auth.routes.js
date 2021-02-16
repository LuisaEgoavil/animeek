const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')

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
            res.redirect('/')
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
                    res.render('auth/login.hbs', {msg: 'Incorrect password'})
                  }
              })
        }
        else {
          res.render('auth/login.hbs', {msg: 'Email does not exist'})
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
  res.render('profile.hbs', {name})
})

//--------------------------------------------------------------
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

//--------------------------------------------------------------







//EXPORT
module.exports = router;