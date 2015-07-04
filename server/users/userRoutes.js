var userController = require('./userController.js');
var utils = require('../config/utility');


module.exports = function (app) {
  // app === userRouter injected from middlware.js
  app.delete('/', userController.deleteUsers);
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.get('/signout', userController.signout);
  app.post('/forgotpassword', userController.forgotpassword);
  app.post('/update', userController.update);
  app.get('/:userId', userController.getUsernameFromId);
  app.post('/loggedIn', userController.loggedIn);
};
