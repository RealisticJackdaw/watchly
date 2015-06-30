// adding 'ngCordova' here pulls in the camera plugin
angular.module('watchly', ['ionic', 'watchly.controllers', 'ngCordova'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
