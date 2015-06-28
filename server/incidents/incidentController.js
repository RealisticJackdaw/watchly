var knex = require('../config/knex-config');
var Incident = require('../db/models/incident');
var Incidents = require('../db/collections/incidents');

module.exports = {  
  findIncident: function (req, res) {
    var body = req.body;

    var xMin = body.xMin;
    var xMax = body.xMax;
    var yMin = body.yMin;
    var yMax = body.yMax;

    knex('incidents')
      .whereBetween('latitude', [xMin, xMax])
      .whereBetween('longitude', [yMin, yMax])
      .then(function (rows) {
        console.log(rows);
        res.send(rows);
      });  
  },

  allIncidents: function (req, res, next) {
    console.log('all incidents controller helper fired');
    knex.select('*').from('incidentTypes')
      .then(function (rows) {
        console.log(rows);
        res.send(rows);
      });
  },

  newIncident: function (req, res, next) {
    var userId = req.session.userId;
    req.body.userId = userId;

    new Incident(req.body).save().then(function (newIncident) {
      Incidents.add(newIncident);
      console.log('added new incident!');
      res.send(newIncident);
    });
  },

  getIncidentTypes: function (req, res, next) {
    knex('incidentTypes')
      .then(function (rows) {
        res.send(rows);
      });
  }

};

