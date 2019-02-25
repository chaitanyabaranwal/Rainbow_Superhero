// load dependencies
var express = require('express');


// Setup express server

var app = express();
app.use(express.static('public'));

// get request
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.listen(3002, function() {
    console.log('Listening on port 3002.');
});