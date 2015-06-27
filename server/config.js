var path = require('path');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'brian',
    database: 'watchly',
    charset: 'utf8',
  }
});

var db = require('bookshelf')(knex);


db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('firstName', 30);
      user.string('lastName', 30);
      user.string('username', 140).unique();
      user.string('email', 40).unique();
      user.bigInteger('phone', 11);
      user.string('salt', 20);
      user.string('password', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('incidentTypes').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('incidentTypes', function (incidentType) {
      incidentType.increments('id').primary();
      incidentType.string('type', 20);
      incidentType.string('iconFilename', 50);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('incidents').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('incidents', function (incident) {
      incident.increments('id').primary();
      incident.integer('userId', 11).references('id').inTable('users').unsigned();
      incident.integer('incidentTypeId', 11).references('id').inTable('incidentTypes').unsigned();
      incident.string('description', 255);
      incident.float('latitude', 10, 6);
      incident.float('longitude', 10, 6);
      incident.string('address', 100);
      incident.string('fuzzyAddress', 100);
      incident.dateTime('occurred_at'); 
      incident.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('messages').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('messages', function (message) {
      message.increments('id').primary();
      message.string('description', 255);
      message.integer('userId', 11).references('id').inTable('users').unsigned();
      message.integer('incidentsId', 11).references('id').inTable('incidents').unsigned();
      message.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});


module.exports = db;
