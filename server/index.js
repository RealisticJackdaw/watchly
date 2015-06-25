// dependencies
var express = require('express');
var app = express();

// serve static files
app.use(express.static('../www'));

// abstract into router module?
app.post('/getIncidents', function (req, res) {
  res.send('POST request to getIncidents');
});

app.post('/submitIncident', function (req, res) {
  res.send('POST request to submitIncident');
});

// set port

app.listen(3000);

console.log('listening on port 3000');
