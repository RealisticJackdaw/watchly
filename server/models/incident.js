var db = require('../config.js').then(function () {


var Incident = db.Model.extend({
  tableName: 'incidents',
  hasTimestamps: true
});

});
// module.exports = Incident;
