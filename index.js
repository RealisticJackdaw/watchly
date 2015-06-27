var app = require('./server/server.js');
var test = require('./server/test-creation.js');

var port = process.env.PORT || 3000;

app.listen(port);

console.log("Watchly is listening on port " + port);
