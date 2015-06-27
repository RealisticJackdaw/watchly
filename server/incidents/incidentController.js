var knex = require('../config/knex-config');

module.exports = {  
  findIncident: function (req, res, next, id) {
  
  },

  allIncidents: function (req, res, next) {
  
  },

  newIncident: function (req, res, next) {

  },

  getIncidentTypes: function (req, res, next) {
    knex.select('type', 'iconFilename').from('incidentTypes')
      .then(function (rows) {
        res.send(rows);
      });
  }

};

