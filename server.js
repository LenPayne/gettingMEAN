/* Getting MEAN Tutorial
 * by Len Payne <len.payne@lambtoncollege.ca>
 */

// Declaring some Constants for Later Use
var LISTENING_PORT = 3000;

// Standard Steps to Initalize/Import the Express Framework
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Sets up an empty, global "posts" collection
var posts = [];

// Sets up the "public" folder to hold publicly available content
app.use(express.static('public'));
// Sets up a special path for Angular based on where npm places it
app.use('/angular', express.static('node_modules/angular'));

// Sets up the app use user the body-parser JSON reader
app.use(bodyParser.json());

// Provides a GET endpoint to return the "posts" collection
app.get('/posts', function(request, response) {
  response.send(posts);
});

// Provides a POST endpoint to accept a new "post"
app.post('/posts', function(request, response) {
  var post = request.body;
  posts.push(post);
  response.send(post);
});

// Configures the app to start listening on port 3000
app.listen(LISTENING_PORT, function() {
  console.log('Now listening on http://localhost:' + LISTENING_PORT);
});
