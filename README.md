# MEAN Web Apps with Len Payne

This tutorial is designed to take a developer from zero to MEAN in roughly 2-3
hours. Knowledge of HTML, CSS and JavaScript is encouraged, but the exercise is
completely do-able from a minimal knowledge perspective.

[Relevant PowerPoint](https://www.dropbox.com/s/1mz5js7au5n57do/MEAN%20Web%20Apps.pptx?dl=0)

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

## Phase Three - Retrieving Dummy Data from the Back-End (Express)

At this point, we have a system that holds posts in active browser memory. So
long as the browser window/tab stays open, the application will display the same
posts and allow you to add more to the list. However, there is no concurrency:
if you navigate to the app from another browser, you will not see the same list
of posts. We will work to fix that next.

On the NodeJS side, we will use the Express framework to create an endpoint to
retrieve a list of posts.

First, we will declare a `posts` collection on the `server.js` file. Near the
top of the file, add the line:

    var posts = [];

This declares a globally-available collection of `posts` objects.

Now, between the `app.use` and the `app.listen` lines, add the following block:

    app.get('/posts', function(request, response) {
      response.send(posts);
    });

This provides an endpoint for the HTTP GET method on the `/posts` URL. It
declares a function that takes in a `request` and a `response` object (this is
how Express works.) The `response` has a method to `send` out some data, and at
this point we return `posts`.

Whenever you make changes to `server.js`, you will need to go to your command
prompt and cancel the current-running `node` process by pressing **Ctrl-C**.
Re-run the process with `node server.js` and you should be able to navigate to
http://localhost:3000/posts and receive `[]` as a response.

### Adding Posts to the Collection

To enable adding Posts, we will want to include a NodeJS middleware called
`body-parser`, that parses the body of a request into objects that we can use.

This is a multi-step process. First, we must change our `package.json` file to
declare that `body-parser` is a required dependency. Modify your `"dependencies"`
object to include the key-value pair: `"body-parser" : "1.x"`.

    "dependencies" : {
      "body-parser" : "1.x",
      ...
    }

Once you save this file, you must re-run `npm install` at the command line.

Now you can go back to `server.js` and declare that `body-parser` is required.
Do this between the `var express` and `var app` lines.

    var express = require('express');
    var bodyParser = require('body-parser');
    var app = express();

Now, we must declare that the `app` actually USES this middleware by adding the
following line after the other `app.use` lines:

    app.use(bodyParser.json());

Finally, we can make an `app.post` block for `/posts` that will receive a JSON
object from Angular and add it to our `posts` collection.

	app.post('/posts', function(request, response) {
	  var post = request.body;
	  posts.push(post);
	  response.send(post);
	});

At this point, if we re-start the `node server.js` process, we will be able to
send a POST to our new server. This can be tested with [Postman](https://www.getpostman.com/),
but we're going to barrel ahead and move back to Angular to add posts to our list.

### Sending New Posts from Angular

On the Angular side, we must use the `$http` service to interact with our
Express endpoints. First, we must declare that we use the `$http` service in our
controller declaration. We add `$http` as a parameter on the function in `app.js`
as so:

    postApp.controller('postCtrl', function($scope, $http)

The rest of the controller requires significant reworking as well. It may be
easiest to do a full re-write:

    postApp.controller('postCtrl', function($scope, $http) {
      $scope.posts = [];

      $scope.getPosts = function() {
        $http.get('/posts').then(
          function(response) {
            $scope.posts = response.data;
          },
          function(response) {
            console.log(response);
          });
      };

      $scope.addPost = function() {
        var newPost = {
          author: $scope.author,
          content: $scope.content
        };
        $http.post('/posts', newPost).then(
          $scope.getPosts,
          function(response) {
            console.log(response);
          });
      };

      $scope.getPosts();
    });

Breaking this down we:

1. Leave the default `posts` collection empty.
2. Set up a `getPosts` function that uses the `$http` service to `get` data from
   our `/posts` resource. This `response.data` is then applied to our `posts`
   collection. The remainder of this block is error reporting.
3. Modify our `addPost` function to send over the `$http` service to `post` data
   to our `/posts` resource. On success, it calls our `getPosts` function.
4. Call out to `getPosts` for the first time to make sure our `posts` information
   is updated when we first load the page.

At this point, we should have a working site that allows us to add and read
posts to our service, that presents the same information across every connected
browser (try it and see: run `node server.js` and go to http://localhost:3000 in
another browser or in incognito mode.)

## Phase Four - Tying the Back-End to a Data Source (MongoDB)

Now that we have our AngularJS app transferring data to/from the NodeJS/Express
server, we are able to show our list of Posts to everyone. You can navigate to
the page in different tabs, and different browsers, and everyone sees the same
Posts.

Unfortunately, there is a small quirk: when the `node server.js` process closes,
all of the data that is stored in memory disappears.

To fix this problem, we need to persist that data to a long-term datastore:
MongoDB. We will simplify our interaction with MongoDB by using a tool called
`mongoose`.

### Connecting to the MongoDB Datastore

In the `server.js` file, add the following lines up near the top (anywhere above
the `app.get` and `app.post` lines):

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/posts');
    var postSchema = mongoose.Schema({author: String, content: String});
    var Post = mongoose.model('Post', postSchema);

Breaking this down:

1. We import the `mongoose` package (which was already imported as part of the
   `package.json` file, and pulled in by `npm install`.)
2. We connect to the MongoDB server running locally, and specifically to the
   `posts` collection.
3. We build a `Schema` that tells `mongoose` exactly what a good `Post` is going
   to look like (ie- it has an author and some content.) This helps prevent us
   from saving bad data into our datastore.
4. We create a data-model named `Post` that uses this schema, and gives us
   access to a great number of tools like `find`, `save`, and others.

### Retrieving Posts from MongoDB

In addition to connecting to the datastore, we need to actually USE it in our
program. The first thing we'll do is modify our `app.get` block so that it finds
the data stored in MongoDB:

    app.get('/posts', function(request, response) {
      Post.find(function(err, posts) {
        if (err)
          response.status(500).send('Failed to retrieve posts');
        else
          response.send(posts);
      });
    });

Breaking this down:

1. We use the `Post` model object to call its `find` method, that will return
   all of the objects in the related collection.
2. If there's an error, we warn the user by setting the status of our `response`
   to be 500, and giving a bit of feedback on what happened.
3. If there was no error, though, we simply respond with the full `posts` object
   straight out of `mongoose`. This will be presented already as a JSON array,
   ready for AngularJS to parse.

### Saving a Post to MongoDB

Our last step of data persistence is to save the Posts that come in from the
outside world. We do this by modifying our `app.post` block:

    app.post('/posts', function(request, response) {
      var post = new Post(request.body);
      post.save(function (err) {
        if (err) {
          response.status(500).send('Failed to save post: ' + request.body);
        } else {
          response.send(post);
        }
      });
    });

Breaking this down:

1. We create a new `Post` model object, and feed it the `request.body`, which in
   our case is a JSON object that holds the author and content.
2. That new `Post` model object has a save method that will talk to `mongoose`
   in the background for us and either succeed or fail.
3. If it fails, we give some feedback to the user, similar to what we did with
   `app.get` previously.
4. If it succeeds, we send the `post` object back as a sign that everything was
   A-Okay.

## Reviewing the Finished Product

At this point, the code is complete and correct. However, we need to make sure
the environment around the code is functional. Namely, we must make sure that
MongoDB is turned on.

This varies by environment, so I will refer you to MongoDB's references for
[Windows](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/),
[OS X](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/), and
[Linux](https://docs.mongodb.org/manual/administration/install-on-linux/).

To verify that your MongoDB instance is configured and running, you should be
able to run `mongo` at the command line with no parameters and it will connect
to your locally running instance. It will look something like this:

    $ mongo
    MongoDB shell version: 2.6.10
    connecting to: test
    > use posts;
    switched to db posts
    > exit;

If you already have some posts in your datastore, you can run `db.posts.find();`
and it will return all of the content in JSON format.

Now you can cancel (Ctrl-C) and re-run your `node server.js` process, and it
should work, and persist the data to the database. You can test this by
navigating to http://localhost:3000 and inserting some data. When you cancel and
re-run the application, the data should still be available in your app.

Congratulations! Your project is now complete! It works! Of course, there's
always more to add...

### Possible Areas of Expansion

1. You can make the user interface more appealing using [Angular-UI](https://angular-ui.github.io/)
   or some custom CSS.
2. You can add features like editing and deleting posts by adding elements to
   the AngularJS forms in `index.html` that send different messages through the
   controller in `app.js` back to the `server.js`. Specifically, we often use
   `$http.put()` to edit messages, and `$http.delete()` to send a message to
   delete.
3. This application does not scale super-well: it sends the WHOLE COLLECTION
   every time you do anything. On a test basis, a handful is fine, but if the
   collection of posts measures in hundreds or thousands, this can slow the
   application down. We can implement paging in the UI and in the Server to make
   this process easier.
4. You can add a login and authentication process of your own devising, or tie
   into an OAuth provider like Google, Facebook or Twitter.

The world is yours for the taking, go get MEAN about it!
