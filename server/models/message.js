var db = require('../config.js');


var Message = db.Model.extend({
  tableName: 'messages',
  hasTimestamps: true
});

module.exports = Message;
