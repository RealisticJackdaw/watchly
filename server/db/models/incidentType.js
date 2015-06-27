var db = require('../../config/dbconfig');


var IncidentType = db.Model.extend({
  tableName: 'incidentsType',
  hasTimestamps: false
});

module.exports = IncidentType;
