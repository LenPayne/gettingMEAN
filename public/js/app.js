// Declares an Angular module called postApp
var postApp = angular.module('postApp', []);

// Declares an Angular controller called postCtrl that uses the scope service
postApp.controller('postCtrl', function($scope, $http) {
  // Declares that a posts model exists that is an empty array
  $scope.posts = [];

  // Provides a method for pulling posts off of the server
  $scope.getPosts = function() {
    $http.get('/posts').then(
      function(response) {
        $scope.posts = response.data;
      },
      function(response) {
        console.log(response);
      });
  };

  // Provides a method for adding a post to the server
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

  // Calls getPosts to set up the posts for the first time
  $scope.getPosts();
});
