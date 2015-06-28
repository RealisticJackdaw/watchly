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

module.exports = knex;
