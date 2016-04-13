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
          <p>Name: <input ng-model="name" />
          <h1>Hello {{name}}</h1>
        </div>
        <script src="/angular/angular.min.js"></script>
      </body>
    </html>

### Running the Server As-Is

At this point, at the command prompt in your `MYAPP` folder, you should be able
to execute `node server.js` and it will inform you that it is listening on
http://localhost:3000.

By navigating to that page with a web browser, you should see:

1. an empty textbox, and
2. The word "Hello".

If you type anything into the textbox, it will appear next to Hello. Type the
word "World" into the textbox and watch the display update. Welcome to Angular.

## Phase Two - Starting from the Front-End (Angular)

At this stage, the next phase is to build the front-end, so that you can shape
what the user will see in the final product. The goal of this project is to
provide a database-backed microblog. Basically, a Twitter clone.

So we need to build:

1. A form to make a new microblog post
2. A display for a list of all posts on the system

For simplicity's sake, we won't be adding full authentication (ie- login) at
this stage.

### The Form

    <div>
      <div>Name: <input ng-model="author" /></div>
      <div>Message: <textarea ng-model="content"></textarea></div>
      <div><button ng-click="addPost()">Post</button></div>
    </div>

Note that this does not use a `<form>` element. The `<form>` element has special
meaning to browsers. We're going to hijack the button manually and want to avoid
any default behaviour.

We created: 1) an `<input>` that ties to an Angular object called `author`; 2) a
`<textarea>` that ties to an Angular object called `content`; and 3) a `<button>`
that asks Angular to call an `addPost()` function when it's clicked.

### The List of Posts

    <div ng-repeat="post in posts">
      <p>{{post.content}}</p>
      <h5>{{post.author}}</h5>
    </div>

This uses Angular's `ng-repeat` system to declare that we're going to read all
of the `post` objects out of a collection of `posts`. For each of the `post`
objects, we create a `<p>` tag, and an `<h5>` holding the post `content` and
`author` respectively. This means, if there are 100 `post` objects in the `posts`
collection, there will be 100 `<div>` tags, with 100 `<p>` and `<h5>` tags too.

### The Controller

In Angular, we use a paradigm called "Model-View-Controller" or MVC. So far, we
have been building the "View" part, and accessing data held in our "Model". Now
we're going to address the "Controller", which is a kind of central station for
communicating between the parts. In our previous steps, an implicit Controller
has been used. Now, we're going to declare an explicit Controller.

Create a new folder in the project called `js`, inside that create a new file
called `app.js` (ie- create `js/app.js`). Include the following code in this new
file:

    var postApp = angular.module('postApp', []);

    postApp.controller('postCtrl', function($scope) {
      $scope.posts = [];
      $scope.addPost = function() {
        var newPost = { author: $scope.author, content: $scope.content};
        $scope.posts.push(newPost);
        $scope.author = '';
        $scope.content = '';
      };
    });

Breaking this down:

1. We declare an Angular `module` that we call `postApp`.
2. We give `postApp` a `controller` that we call `postCtrl`: it accepts the
   `$scope` service.
3. We declare an object on the `$scope` called `posts` that starts as an empty
   collection (ie- `[]`). This is our "Model."
4. We declare a function on the `$scope` called `addPost` that: 1) builds a
   `newPost` object that holds the current `author` and `content` data in the
   "Model"; 2) pushes the `newPost` onto the `posts` collection.
5. Sets `author` and `content` back to empty.

### Gluing the Controller Back Onto the View

We need to tie this code back to the HTML page. In `index.html` we need a new
`<script>` tag. Below the existing `<script>` tag add the following:

    <script src="/js/app.js"></script>

Now that we have an Angular Module, and a Controller, we also need to tag them
into the HTML using `ng-app` and `ng-controller` attributes.

Modify the existing `<body>` and opening `<div>` tags to be:

    <body ng-app="postApp">
      <div ng-controller="postCtrl">
      ... The Form and The List Should Be Here ...
      </div>
      <script src="/angular/angular.min.js"></script>
      <script src="/js/app.js"></script>
    </body>

After completing all of these steps (and only after completing ALL of these
steps,) you will be able to navigate to http://localhost:3000/ and be able to
add posts to your collection.
