window.fbAsyncInit = function() {
  FB.init({
    appId      : '803441133104253',
    xfbml      : true,
    version    : 'v2.3'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

var fb = new Firebase("https://shining-inferno-5149.firebaseio.com/");

// adding 'ngCordova' here pulls in the camera plugin
angular.module('watchly', ['ionic', 'watchly.controllers', 'ngCordova', 'firebase'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
