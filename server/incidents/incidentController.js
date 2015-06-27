var Incident = require('../models/incident');
var Incidents = require('../collections/incidents');
var IncidentType = require('../models/incident');
var IncidentTypes = require('../collections/incidentTypes');

module.exports = {
  findIncident: function (req, res, next, id) {
  },

  allIncidents: function (req, res, next) {
  },

  newIncident: function (req, res, next) {

  },
  getIncidentTypes: function (req, res, next) {
    IncidentTypes.reset().fetch()
      .then( function (types){
        res.send(200, types.models);
      });
  }
};
