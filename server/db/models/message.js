var db = require('../../config/dbconfig');

var Message = db.Model.extend({
  tableName: 'messages',
  hasTimestamps: true
});

module.exports = Message;
