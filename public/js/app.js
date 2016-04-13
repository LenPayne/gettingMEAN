// Declares an Angular module called postApp
var postApp = angular.module('postApp', []);

// Declares an Angular controller called postCtrl that uses the scope service
postApp.controller('postCtrl', function($scope) {
  // Declares that a posts model exists that is an empty array
  $scope.posts = [];

  // Provides a method for adding a post to the posts model
  $scope.addPost = function() {
    var newPost = { author: $scope.author, content: $scope.content};
    $scope.posts.push(newPost);
    $scope.author = '';
    $scope.content = '';
  };
});
