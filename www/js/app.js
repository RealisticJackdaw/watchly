// adding 'ngCordova' here pulls in the camera plugin
var fb = new Firebase("https://shining-inferno-5149.firebaseio.com/");

angular.module('watchly', ['ionic', 'watchly.controllers', 'ngCordova', 'firebase'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
