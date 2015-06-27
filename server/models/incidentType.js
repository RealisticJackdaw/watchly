var db = require('../config.js');


var IncidentType = db.Model.extend({
  tableName: 'incidentsType',
  hasTimestamps: false
});

module.exports = IncidentType;
