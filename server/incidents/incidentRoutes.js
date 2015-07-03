var incidentController = require('./incidentController.js');

module.exports = function (app) {
  // app === linkRouter injected from middleware.js
  console.log('incident routes module run')
  app.route('/')
    .get(incidentController.allIncidents)
    .post(incidentController.newIncident);

  app.route('/nearby')
    .post(incidentController.findIncident);

  app.route('/incidentType')
    .get(incidentController.getIncidentTypes);

  app.route('/upvote')
    .post(incidentController.upvoteIncident);

  app.route('/downvote')
    .post(incidentController.downvoteIncident);

};
