var incidentController = require('./incidentController.js');

module.exports = function (app) {
  // app === linkRouter injected from middleware.js
  app.route('/')
    .get(incidentController.allIncidents)
    .post(incidentController.newIncident);

  app.route('/incidentType')
    .get(incidentController.getIncidentTypes);

};
