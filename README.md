# MEAN Web Apps with Len Payne

This tutorial is designed to take a developer from zero to MEAN in roughly 2-3
hours. Knowledge of HTML, CSS and JavaScript is encouraged, but the exercise is
completely do-able from a minimal knowledge perspective.

## Agenda

* Environment Setup (`git`, `node`, `npm`, `mongo`, `angular`)
* Demonstration of the Finished Product
* Building a Stand Alone Server (Node)
* Starting from the Front-End (Angular)
* Retrieving Dummy Data from the Back-End (Express)
* Tying the Back-End to a Data Source (MongoDB)
* Review of the Finished Product
* Publishing to the Cloud

## Environment Setup

This tutorial assumes you have at least the following installed:

* [Git Source Control Management](https://git-scm.com/)
* [Node.js and `npm`](https://nodejs.org)
* [MongoDB](https://www.mongodb.org/)

To configure each of these, please follow the best practices for your system
based on the respective tutorials provided above.

When you are completed, the following commands should output similar results
(version numbers may vary):

`git --version`

    git version 2.5.0

`node --version && npm --version`

    v5.1.0
    3.3.12

`mongod --version`

    db version v2.6.10

## The Finished Product

Clone this repository using `git clone https://github.com/LenPayne/gettingMEAN
MYAPP` where `MYAPP` is the name of your app.

When this command has completed, you should be able to run the following to
begin the server:

    cd MYAPP
    npm install
    node server.js

At this point, you will be able to navigate to http://localhost:3000 and see
the finished product.

To build this from scratch, perform `git checkout Phase-0` and perform the
following steps.

## Phase One - The Standalone Server

### Building an Express App

Create a file called `server.js` and insert the following code:

    var LISTENING_PORT = 3000;

    var express = require('express');
    var app = express();

    app.use(express.static('public'));
    app.use('/angular', express.static('node_modules/angular'));

    app.listen(LISTENING_PORT, function() {
      console.log('Now listening on http://localhost:' + LISTENING_PORT);
    });

These steps achieve the following goals:

1. Configures a variable called `LISTENING_PORT` for later use.
2. Imports and configures the start of an ExpressJS application.
3. Allows the ExpressJS app to use the `public` folder to store documents that
   will be publicly accessible on the web.
4. Allows the ExpressJS app to provide a web-facing route to the `angular`
   folder, so that AngularJS can be reached after being installed by `npm`.
5. Sets the ExpressJS app to listen on `LISTENING_PORT` and provides feedback
   to the user.

### Populating the `public` Folder

Now that we've said "the `public` folder is publicly accessible on the web" we
must create this `public` folder, and give it some basic content.

Inside the `public` folder, create the file `index.html` and give it the
following content:

    <!DOCTYPE html>
    <html>
      <head>
        <title>Getting MEAN</title>
      </head>
      <body>
        <div ng-app>
          <p>Name: <input ng-model="name" /></p>
          <h1>Hello {{name}}</h1>
        </div>
        <script src="/angular/angular.min.js"></script>
      </body>
    </html>

### Running the Server As-Is

At this point, at the command prompt in your `MYAPP` folder, you should be able
to execute `node server.js` and it will inform you that it is listening on
http://localhost:3000.

By navigating to that page with a web browser, you should
see:

1. an empty textbox, and
2. The word "Hello".

If you type anything into the textbox, it will appear next to Hello. Type the
word "World" into the textbox and watch the display update. Welcome to Angular.
