angular.module('watchly.controllers', ['watchly.services'])

  .controller('MapCtrl', function ($scope, $http, $ionicModal, $ionicLoading, $ionicSideMenuDelegate, $compile, Auth, Incidents, Messages) {

    function initialize() {
        $scope.geoCoder = new google.maps.Geocoder();
        var mapOptions = {
          // Center on Hack Reactor    
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
        $scope.populateIncidentTypes();
        $scope.getIncidents();
        $scope.setDateAndTime();

        google.maps.event.addListener(map, 'mousedown', function (event) {
          console.log("heard  mousedown");
          clearTimeout($scope.downTimer);
          $scope.downTimer = setTimeout(function () {
            $scope.placeMarker(event.latLng);
          }, 1000);
        });

        google.maps.event.addListener(map, 'mouseup', function (event) {
          console.log("heard mouseup");
          clearTimeout($scope.downTimer);          
        });

    }
    
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.incidentTypes = [];
    $scope.incidentTypeNames = {};
    $scope.incidents = [];
    $scope.mapBounds = {};

    $scope.setMapBounds = function () {
      console.log("Calculating and setting map bounds...");
      var bounds = $scope.map.getBounds();
      var northEastBound = bounds.getNorthEast();
      var southWestBound = bounds.getSouthWest();
      $scope.mapBounds.minLat = southWestBound.A;
      $scope.mapBounds.maxLat = northEastBound.A;
      $scope.mapBounds.minLon = southWestBound.F;
      $scope.mapBounds.maxLon = northEastBound.F;
    }

    $scope.getIncidents = function() {
      Incidents.getAllIncidents().then(function (result) {
        $scope.incidents = result[0];
        $scope.renderAllIncidents();
      });
    };

    $scope.renderAllIncidents = function() {
      for (var i = 0; i < $scope.incidents.length; i++) {
        $scope.renderIncident($scope.incidents[i]);
      }
    };

    $scope.infoWindows = [];

    $scope.renderIncident = function(incidentObj) {
      var incidentPos = new google.maps.LatLng(incidentObj.latitude, incidentObj.longitude);
      var incidentIcon = "./img/" + incidentObj.iconFilename;
      var incident = new google.maps.Marker({
        position: incidentPos,
        map: $scope.map,
        icon: incidentIcon
      });

      var incidentInfoWindowContent = '<div class="incidentInfoTitle"> ' + incidentObj.type + ' on ' + incidentObj.fuzzyAddress + ' </div>' + 
      '<div class="incidentInfoDescription"> ' + 'User Description: ' + incidentObj.description + ' </div>' + 
      '<div class="incidnetInfoUsername"> ' + 'Reported by: ' + incidentObj.username + ' to have occured on ' + incidentObj.occurred_at + '</div>';

      var incidentInfoWindow;

      google.maps.event.addListener(incident, 'click', function() {
         $scope.infoWindows.forEach(function(window) {
           window.close();
         });
         incidentInfoWindow = new google.maps.InfoWindow({
           content: incidentInfoWindowContent
         });
         $scope.infoWindows.push(incidentInfoWindow);
         incidentInfoWindow.open($scope.map,incident);
       });
    };

    $scope.populateIncidentTypes = function () {
      console.log("Called populate incidents");
      Incidents.getIncidentTypes().then(function (result) {
        $scope.incidentTypes = result;
        result.forEach(function (incidentType) {
          $scope.incidentTypeNames[incidentType.type] = incidentType.id;
        })
      });
    };

    $scope.setDateAndTime = function () {
      var incidentDate = document.getElementsByClassName('incidentDate')[0];
      var incidentTime = document.getElementsByClassName('incidentTime')[0];
      incidentDate.value = $scope.newIncident.curDate;
      incidentTime.value = $scope.newIncident.curTime;
    };

    // TODO Change this to current time rather than being hard coded
    // var today = new Date();
    $scope.newIncident = {};
    $scope.newIncident.curDate = "";
    $scope.newIncident.curTime = "";
    // $scope.newIncident.date = today.format("YYYY-MM-DD");
    // value="{{newIncident.time | date : 'hh:mm'}}
    // $scope.newIncident.time = today.format("hh:mm A");

    $scope.incidentReportForm = {
      hidden: true
    }

    $scope.createIncidentButton = {
      hidden: true
    };

    $scope.cancelIncidentButton = {
      hidden: true
    };

    $scope.downTimer;
    $scope.newIncidentMarker;

    $scope.placeMarker = function (location) {
      if (!$scope.newIncidentMarker) {
        console.log(location);
        $scope.newIncidentMarker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: location,
            map: $scope.map,
            icon: {
              url: "./img/other.png",
              size: new google.maps.Size(25, 25)
            }
          });
        $scope.revealConfirmCancel();
        $scope.userIncident.location = location;
        $scope.userIncident.longitude = location.lng();
        $scope.userIncident.latitude = location.lat();
      }
      if ($scope.newIncidentMarker) {
        $scope.newIncidentMarker.setMap(null);
        $scope.newIncidentMarker = false;
        console.log(location);
        $scope.newIncidentMarker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: location,
            map: $scope.map,
            icon: {
              url: "./img/other.png",
              size: new google.maps.Size(25, 25)
            }
          });
        $scope.revealConfirmCancel();
        $scope.userIncident.location = location;
        $scope.userIncident.longitude = location.lng();
        $scope.userIncident.latitude = location.lat();
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

    $scope.userIncident = {
      location: "",
      latitude: "",
      longitude: "",
      fuzzyAddress: ""
    }

    $scope.submitIncident = function (incident) {
      console.log("Heard incident submit");
      var dbIncident = {};
      // $scope.removeIncident();

      dbIncident.description = incident.description || "N/A";
      dbIncident.incidentTypeId = incident.type || 1;
      // dbIncident.incidentTypeId = $scope.incidentTypeNames[incident.type];
      dbIncident.occurred_at = incident.curDate + " " + incident.curTime;
      dbIncident.latitude = $scope.userIncident.latitude;
      dbIncident.longitude = $scope.userIncident.longitude;
      dbIncident.description = incident.description;
      $scope.reverseGeo($scope.userIncident.location, function(){
        // TODO Figure out if we can reverseGeo the real address...placeholder for now.
        dbIncident.address = $scope.userIncident.fuzzyAddress;
        dbIncident.fuzzyAddress = $scope.userIncident.fuzzyAddress;
        debugger;
        Incidents.createNewIncident(dbIncident);
      });
    }

    $scope.reverseGeo = function(location, next) {
      $scope.geoCoder.geocode({'latLng': location}, function (result, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log(result);
          $scope.userIncident.address = result[0].formatted_address;
          $scope.userIncident.fuzzyAddress = result[1].formatted_address;
          next();
        } else {
          console.log("Error Retrieving Address");
        }
      })
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


    $ionicModal.fromTemplateUrl('templates/signin.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
    }).then(function(modal) {
      $scope.signInModal = modal;         
    });


    $ionicModal.fromTemplateUrl('templates/signup.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
    }).then(function(modal) {
      $scope.signUpModal = modal;         
    });

    $ionicModal.fromTemplateUrl('templates/forgotpassword.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
    }).then(function(modal) {
      $scope.forgotPasswordModal = modal;         
    });    

    $ionicModal.fromTemplateUrl('templates/profile.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function(modal) {
      $scope.profileModal = modal;       
    });

    $scope.profileActivate = function () { 
      if(Auth.isAuthenticated()) {
        $scope.user = Auth.getUser();
        $scope.profileModal.show();   
        console.log("already authenticated");
      }
      else {
        $scope.signInModal.show();
        console.log("Has been NOT authenticated");
      }
    };

    $scope.openSignInModal = function() {
      $scope.signInModal.show();
    };

    $scope.closeSignInModal = function() {
      $scope.signInModal.hide();
    };

    $scope.openSignUpModal = function() {
      $scope.signUpModal.show();
    };

    $scope.closeSignUpModal = function() {
      $scope.closeSignUpModal.hide();
    };

    $scope.openForgotPasswordModal = function() {
      $scope.forgotPasswordModal.show();
    };

    $scope.closeForgotPasswordModal = function() {
      $scope.forgotPasswordModal.hide();
    };

    $scope.closeProfileModal = function() {
      $scope.profileModal.hide();
    };

    $scope.signUp = function(user) {
      Auth.signup(user).then(function(res) {
        $scope.closeSignUpModal();
      });
    };

    $scope.signIn = function(user) {
      Auth.signin(user).then(function(res) {
        $scope.closeSignInModal();
      });
    };

    $scope.signOut = function() {
      Auth.signout().then(function(res) {
        $scope.closeProfileModal();
      });
    };

    $scope.forgotPassword = function(email) {
      Auth.forgotpassword(email).then(function(res) {
        $scope.closeForgotPasswordModal();
      });
    };

    $scope.isValidPhoneNumber = function(number) {
      return number ? number.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/) : false;
    };

    $scope.isValidEmail = function(email) {
      return email ? email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) : false;
    };
  });
