Users = require('../models/user');


module.exports = {
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;


  },

  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password;
  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
  }
};
