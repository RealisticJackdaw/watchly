var db = require('../config.js')


var Incident = db.Model.extend({
  tableName: 'incidents',
  hasTimestamps: true
});

module.exports = Incident;
