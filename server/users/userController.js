var util = require('../config/utility');
var User = require('../db/models/user');


module.exports = {
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    new User({username: username}).fetch().then(function(user){
      if( !user ){  
        res.status(401).send("Unknown user");
      }
      else {
        user.comparePassword(password, function(match){
          if( match) {
            util.createSession(req, res, user);
          } 
          else {
            res.redirect('/login');
          }
        });
      }
   });
  },

  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password;

    new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save().then(function(savedUser){
          util.createSession(req, res, savedUser);
        });
      } 
      else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });    

  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
  },

  signout: function (req, res, next) {
    req.session.destroy(function(){
      res.redirect('/login');
    });
  }
};
