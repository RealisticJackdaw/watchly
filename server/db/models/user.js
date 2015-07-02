var db = require('../../config/dbconfig');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function(){
    this.on('creating', this.createPassword);
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(){
    this.set('password', bcrypt.hashSync(this.get('password'), this.get('salt')));
  },
  generateSalt: function(){
    this.set('salt', bcrypt.genSaltSync(10));
  },
  createPassword: function() {
    this.generateSalt();
    this.hashPassword();   
  }
});

module.exports = User;
