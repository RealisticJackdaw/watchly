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
        res.send(rows);
      });  
  },

  allIncidents: function (req, res, next) {
    console.log('all incidents controller helper fired');
    var query = 'select users.username, incidents.*, incidentTypes.type, incidentTypes.iconFilename from incidents, users,incidentTypes where incidents.userid = users.id and incidents.incidentTypeId = incidentTypes.id';
    knex.raw(query)
    // knex.select('*').from('incidents')
      .then(function (rows) {
        res.send(rows);
      });
  },

  newIncident: function (req, res, next) {
    var userId = req.session.userId;
    if (userId) {
      req.body.userId = userId;

      new Incident(req.body).save().then(function (newIncident) {
        Incidents.add(newIncident);
        res.send(newIncident);
      });
    }
    else {
      res.status(401).send("Unknown user");
    }
  },

  getIncidentTypes: function (req, res, next) {
    knex('incidentTypes')
      .then(function (rows) {
        res.send(rows);
      });
  }

};

