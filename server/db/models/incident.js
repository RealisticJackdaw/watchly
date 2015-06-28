var db = require('../../config/dbconfig');


var Incident = db.Model.extend({
  tableName: 'incidents',
  hasTimestamps: true
});

module.exports = Incident;
