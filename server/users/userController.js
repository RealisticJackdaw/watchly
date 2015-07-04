var utils = require('../config/utility');
var User = require('../db/models/user');
var url = require('url')


module.exports = {
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    new User({username: username}).fetch().then(function(user){
      if( !user ){
        res.status(401).send({error: "Unknown user"});
      }
      else {
        user.comparePassword(password, function(match){
          if( match) {
            utils.createSession(req, res, user);
            res.status(200).send(user);
          } else {
            res.status(401).send({error: "Incorrect username or password"});
          }
        });
      }
   });
  },

  signup: function (req, res, next) {
    var user = req.body;
    new User({ username: user.username }).fetch().then(function(exist) {
      if (!exist) {
        var newUser = new User({
          username: user.username,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }).save().then(function(savedUser){
          utils.createSession(req, res, savedUser);
          res.send(savedUser);
        });
      }
      else {
        console.log('Account already exists');
        res.status(400).send({error: 'Account already exists'});
      }
    });

  },

  signout: function (req, res, next) {
    req.session.destroy(function(){
      res.redirect('/');
    });
  },

  //TODO: send emails to users who forgot their passwords
  forgotpassword: function (req, res, next) {
    var email = req.body.email;

    new User({email: email}).fetch().then(function(user){
      if( !user ){
        res.status(401).send({error: "Unknown user"});
      }
      else {
        console.log("Found user account with the email supplied " + user);
        res.send();
      }

    });
  },

  update : function (req, res, next) {
    var oldUsername = req.body.oldUsername;
    var info = req.body.user;
    new User({username: oldUsername}).fetch().then(function(exist){
      if (exist) {
        new User({ username: info.username }).fetch().then(function(user) {
          if(user){
            console.log('Username already exists');
            res.status(400).send({error: 'Username already exists'});
          }
          else {
            exist.save(info).then(function(savedUser) {
              res.send(savedUser);
            });
          }
        });
      } else {
        console.log("Unknown user");
        res.status(401).send({error: "Unknown user"});
      }
    });
  },

  getUsernameFromId: function(req, res, next) {
    var uri = req.url;
    var userId = (url.parse(uri).pathname).slice(1);
    new User({id: userId}).fetch().then(function(user){
      if( !user ){
        res.status(401).send({error: "Unknown user"});
      } else {
        res.status(200).send(user);
      }
    });
  },
  //determines if a user has a current session token and signs them in if so
  loggedIn: function(req, res) {
    if (req.session.userId) {
      new User({id: req.session.userId}).fetch().then(function(user) {
        if (user) {
          res.status(200).send(user);
        } else {
          res.status(200).send('');
        }
      })
    } else {
      console.log('not signed in');
      res.status(200).send('');
    }
  },

  deleteUsers: function(req,res,next) {
    console.log('deleting users');
    User.collection().fetch().then(function(collection) {
      collection.invokeThen('destroy').then(function() {
    // ... all models in the collection have been destroyed
        if (new User().fetchAll().length > 0) {
          res.status(401).send({error: "unable to delete users"});
        } else {
          res.status(200).send('users table deleted');
        }
      });
    });
  }

};
