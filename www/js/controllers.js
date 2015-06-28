angular.module('watchly.controllers', [])

.controller('MapCtrl', function ($scope, $http, $ionicLoading, $ionicSideMenuDelegate) {

  //
  // INCIDENTS //
  //

  // get all incidents
  $http.get('api/incidents/')
    .success(function (data) {
      debugger
    })
    .error(function (err) {
      debugger
    });

  // post a new incident
  // pass the following data:
  //{ 
  //   username: username,
  //   description: description,
  //   latitude: latitude, 
  //   longitude: longitude,
  //   address: address,
  //   fuzzyAddress: fuzzyAddress,
  //   occurred_at: occurred_at
  // }
  $http.post('api/incidents/', { address: 'test' }) // this is abbreviated to just include address, but posts should include everything above
    .success(function (data) {
      debugger
    })
    .error(function (err) {
      debugger
    });

  // post map x,y min and max to get incidents within map
  $http.post('api/incidents/nearby', {xMin: 0, xMax: 100, yMin: -200, yMax: 100} )
    .success(function (data) {
      debugger
    })
    .error(function (err) {
      debugger
    });

  // get all incident types
  $http.get('api/incidents/incidentType')
    .success(function (data) {
      debugger
    })
    .error(function (err) {
      debugger
    });

  //
  // MESSAGES //
  //

  // post a new message, passing an incidentId
  $http.post('api/messages/', { incidentsId: 1, description: 'hey I saw that too' })
    .success(function (data) {
      debugger
    })
    .error(function (err) {
      debugger
    });

  // get thread of messages about an incident by posting an incidentId to thread endpoint
  $http.post('api/messages/thread', { incidentsId: 1 })
    .success(function (data) {
      debugger
    })
    .error(function (err) {
      debugger
    });

     

  //
  // END API CALL EXAMPLES   
  //


  $scope.incidents = [];

  ionic.EventController.on('initialize', function () {
    console.log("Heard initialize, populating incidentReportForm");
    $scope.populateIncidents();
    $scope.$apply();
  }, $scope.map);

  $scope.populateIncidents = function () {
    console.log("Called populate incidents");
    $http.get('/getIncidentTypes').then(function (res) {
      console.log('Successfully got incident types', res);
      for (var i = 0; i < res.data.length; i++) {
        $scope.incidents.push(res.data[i]);
      }
    }, function (err) {
      console.error('Unable to retrieve incidents', err);
    });
  };

  $scope.curDate = "2015-06-27";
  $scope.curTime = "12:00";

  $scope.incidentReportForm = {
    hidden: true
  };

  $scope.createIncidentButton = {
    hidden: true
  };

  $scope.cancelIncidentButton = {
    hidden: true
  };

  $scope.confirmIncidentCreate = function () {
    console.log("User confirmed incident create, incidentReportForm.hidden set to false");
    $scope.incidentReportForm.hidden = false;
  };

  // Listener for createIncident coming from map directive
  // Makes ng-hide for create/cancelIncidentButtons buttons false
  ionic.EventController.on('createIncident', function () {
    console.log("Heard createIncident, setting CIBs.hidden to false");
    $scope.createIncidentButton.hidden = false;
    $scope.cancelIncidentButton.hidden = false;
    $scope.$apply();
  }, $scope.map);

  // Makes ng-hide for create/cancelIncidentButtons buttons true
  $scope.removeIncident = function () {
    console.log("Called removeIncident, setting CIBs.hidden to true");
    console.log("Triggered removeIncident");
    // Triggers removeIncident so map directive knows to remove createIncident Marker
    ionic.EventController.trigger('removeIncident');
    $scope.incidentReportForm.hidden = true;
    $scope.createIncidentButton.hidden = true;
    $scope.cancelIncidentButton.hidden = true;
  };

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
