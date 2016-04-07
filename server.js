/* Getting MEAN Tutorial
 * by Len Payne <len.payne@lambtoncollege.ca>
 */

// Declaring some Constants for Later Use
var LISTENING_PORT = 3000;

// Standard Steps to Initalize/Import the Express Framework
var express = require('express');
var app = express();

// Sets up the "public" folder to hold publicly available content
app.use(express.static('public'));
// Sets up a special path for Angular based on where npm places it
app.use('/angular', express.static('node_modules/angular'));

// Configures the app to start listening on port 3000
app.listen(LISTENING_PORT, function() {
  console.log('Now listening on http://localhost:' + LISTENING_PORT);
});
