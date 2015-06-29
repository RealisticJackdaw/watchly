var knex = require('knex')({
  client: 'mysql',
  connection: {
    user: 'root',
    host: '127.0.0.1',
    password: 'brian',
    database: 'watchly',
    charset: 'utf8'
  }
});

module.exports = knex;
