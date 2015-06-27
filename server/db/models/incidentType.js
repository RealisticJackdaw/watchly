var db = require('../../config/dbconfig');

var IncidentType = db.Model.extend({
  tableName: 'incidentTypes',
  hasTimestamps: false
});

module.exports = IncidentType;
