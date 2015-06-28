angular.module('watchly', ['ionic', 'watchly.controllers', 'watchly.directives'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
