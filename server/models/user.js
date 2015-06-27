var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

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
    var cipher = Promise.promisify(bcrypt.hash);
    // return a promise - bookshelf will wait for the promise
    // to resolve before completing the create action
    return cipher(this.get('password'), this.get('salt'), null)
      .bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  },
  generateSalt: function(){
    var cipher = Promise.promisify(bcrypt.genSalt);
    // return a promise - bookshelf will wait for the promise
    // to resolve before completing the create action
    return cipher(10)
      .bind(this)
      .then(function(salt) {
        this.set('salt', salt);
      });
  },
  createPassword: function() {
    this.generateSalt().then(function() {
      this.hashPassword();
    });
  }
});

module.exports = User;
