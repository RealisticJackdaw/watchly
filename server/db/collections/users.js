var db = require('../../config/dbconfig');

var User = require('../models/User.js');

var Users = new db.Collection();
Users.model = User;

module.exports = Users;
