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
