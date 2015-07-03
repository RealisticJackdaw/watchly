/**
  THIS CODE SHOULD NOT BE RUN! IT IS HERE AS AN EXAMPLE OF HOW TO SET UP FIREBASE
*/

//At the top of your app.js file, outside any AngularJS code, 
//you want to add the following line:

var fb = new Firebase("https://shining-inferno-5149.firebaseio.com/");

//We also need to add firebase to our AngularJS module. 
//In the end it will look something like this:

var imageApp = angular.module("starter", ["ionic", "ngCordova", "firebase"]);

//from here on out, all code should be part of a controller

imageApp.controller("uploadController", function($scope, $firebaseArray, $cordovaCamera){


  $scope.images = [];
  var eventReference = fb.child("events/" + event_id);
  var syncArray = $firebaseArray(eventReference.child("images"));

  $scope.images = syncArray;
  //image data needs to be in base 64 (so that it can be stored as a string)
  
  $scope.upload = function(username) {
    //these options are for Cordova, not firebase
    var options = {
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      syncArray.$add({image: imageData, username: username}).then(function() {
        alert("Image has been uploaded");
      });
    }, function(error) {
      console.error(error);
    });
  }

})





