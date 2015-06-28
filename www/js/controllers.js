angular.module('watchly.controllers', [])

  .controller('MapCtrl', function ($scope, $http, $ionicLoading, $ionicSideMenuDelegate, $compile) {

    function initialize() {

        var mapOptions = {
          // Center on Hack Reactor
          // TODO: Change to User's current position
          center: new google.maps.LatLng(37.783726, -122.408973),
          zoom: 18,
          // mapTypeId: google.maps.MapTypeId.ROADMAP
          disableDoubleClickZoom: true,
          // Pegman Street View
          streetViewControl: false,
          // Zoom Control Bar
          zoomControl: true,
          zoomControlOptions: {
            // .SMALL, .LARGE, .DEFAULT
            style: google.maps.ZoomControlStyle.SMALL,
            // .LEFT_BOTTOM, .RIGHT_CENTER etc.
            position: google.maps.ControlPosition.TOP_RIGHT
          },
          // Cardinal Direction Controller
          panControl: false,
          // Map/Satellite View Switch
          mapTypeControl: false,
          mapTypeControlOptions: {
            // .HORIZONTAL_BAR, .DROPDOWN_MENU, .DEFAULT
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
          },
          // Display scale control at bottom of map
          scaleControl: false,
          // Display map overview nav at bottom of map
          overviewMapControl: false,
          // Map stylers
          styles: [{featureType: "poi.business",elementType: "labels",stylers: [{ visibility: "off" }]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
        };

        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        $scope.map = map;

        $scope.createStubs();
        $scope.populateIncidents();
        $scope.setDateAndTime();
        google.maps.event.addListener(map, 'mousedown', function (event) {
          console.log("heard  mousedown");
          clearTimeout($scope.downTimer);
          $scope.downTimer = setTimeout(function () {
            $scope.placeMarker(event.latLng);
          }, 1500);
        });

        google.maps.event.addListener(map, 'mouseup', function (event) {
          console.log("heard mouseup");
          clearTimeout($scope.downTimer);          
        });

    }
    
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.incidents = [];

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

    $scope.setDateAndTime = function () {
      var incidentDate = document.getElementsByClassName('incidentDate')[0];
      var incidentTime = document.getElementsByClassName('incidentTime')[0];
      incidentDate.value = $scope.curDate;
      incidentTime.value = $scope.curTime;
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

    $scope.downTimer;
    $scope.newIncident;

    $scope.placeMarker = function (location) {
      if (!$scope.newIncident) {
        $scope.newIncident = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: location,
            map: $scope.map,
            icon: {
              url: "./img/other.png",
              size: new google.maps.Size(25, 25)
            }
          });
        $scope.revealConfirmCancel();
      }
    };

    $scope.confirmIncidentCreate = function () {
      console.log("User confirmed incident create");
      $scope.incidentReportForm.hidden = false;
    };

    $scope.revealConfirmCancel = function () {
      $scope.createIncidentButton.hidden = false;
      $scope.cancelIncidentButton.hidden = false;
      $scope.$apply();
    };

    $scope.hideConfirmCancel = function () {
      $scope.createIncidentButton.hidden = true;
      $scope.cancelIncidentButton.hidden = true;
      $scope.incidentReportForm.hidden = true;
    };

    $scope.removeIncident = function () {
      $scope.newIncident.setMap(null);
      $scope.newIncident = false;
      $scope.hideConfirmCancel();
    };

    $scope.submitIncident = function () {
      console.log("heard incident submit");
    }

    $scope.centerMapOnUser = function () {
        if (!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
          });

        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
          }, function (error) {
            alert('Unable to get location: ' + error.message);
          });
      };

    // Placeholder/debugging functions

    $scope.testAlertProfile = function () {
      console.log("Clicked Profile placeholder");
    };

    $scope.createStubs = function() {
      var pedHazard = new google.maps.Marker({
        position: {lat: 37.783568, lng: -122.408840},
        map: $scope.map,
        icon: "./img/ped_hazard.png",
        title: "STUB_DRUG"
      });

      var drugMarker = new google.maps.Marker({
        position: {lat: 37.783806, lng:  -122.408490},
        map: $scope.map,
        icon: "./img/drug_use.png",
        title: "STUB_DRUG2"
      });

      var potholeMarker = new google.maps.Marker({
        position: {lat: 37.783844, lng: -122.409239},
        map: $scope.map,
        icon: "./img/road_hazard.png",
        title: "STUB_ROAD_HAZARD"
      });

      var potholeMarker2 = new google.maps.Marker({
        position: {lat: 37.783225, lng: -122.409102},
        map: $scope.map,
        icon: "./img/road_hazard.png",
        title: "STUB_ROAD_HAZARD2"
      });

      var graffitiMarker = new google.maps.Marker({
        position: {lat: 37.783901, lng: -122.409126},
        map: $scope.map,
        icon: "./img/vandalism.png",
        title: "STUB_GRAFFITI"
      });
    };

  });