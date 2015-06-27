angular.module('watchly.controllers', [])

.controller('MapCtrl', function ($scope, $ionicLoading, $ionicSideMenuDelegate) {

  $scope.stubs = {

    testDealer: {
      pos: {lat: 37.783568, lng: -122.408840},
      img: "./www/img/drug.png",
      title: "STUB_DRUG"
    },

    testDealer2: {
      pos: {lat: 37.783806, lng:  -122.408490},
      img: "./www/img/drug.png",
      title: "STUB_DRUG2"
    },

    testHazard: {
      pos: {lat: 37.783844, lng: -122.409239},
      img: "./www/img/hazard.png",
      title: "STUB_ROAD_HAZARD"
    },

    testHazard2: {
      pos: {lat: 37.783225, lng: -122.409102},
      img: "./www/img/hazard.png",
      title: "STUB_ROAD_HAZARD2"
    },

    testGraffiti: {
      pos: {lat: 37.783901, lng: -122.409126},
      img: "./www/img/graffiti.png",
      title: "STUB_GRAFFITI"
    }
  };

  $scope.debugLog = function () {
    console.log("Debug Log Fired");
  };

  $scope.reportForm = {
    hidden: true
  };

  $scope.createIncidentButton = {
    hidden: true,
  };

  $scope.cancelIncidentButton = {
    hidden: true,
  };
  
  ionic.EventController.on('createIncident', function () {
    console.log("Heard createIncident, setting cib.hidden to false");
    // WHY DOESN'T THIS UPDATE THE NG-HIDE???
    $scope.createIncidentButton.hidden = false;
    $scope.cancelIncidentButton.hidden = false;
    console.log($scope.cancelIncidentButton.hidden);
    $scope.$apply();
  }, $scope.map);

  $scope.mapCreated = function (map) {
    $scope.map = map;
  };

  $scope.testAlertProfile = function () {
    console.log("Clicked Profile placeholder");
  };

  $scope.testAlertForum = function () {
    console.log("Clicked Forum placeholder");
  };

  $scope.centerMapOnUser = function () {
    console.log("Centering map on User's Current Location");
    if (!$scope.map) {
      return;
    }
    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

});