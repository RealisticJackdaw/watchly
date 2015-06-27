var userController = require('./userController.js');
var utils = require('../config/utility');


module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.post('/signin', utils.checkUser, userController.signin);
  app.post('/signup', userController.signup);
  // app.get('/signedin', userController.checkAuth);
};
