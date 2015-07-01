angular.module('watchly.controllers', ['watchly.services', 'ngFileUpload', 'ngCordova', 'firebase'])

.controller('MapCtrl', function($scope, $http, $ionicModal, $ionicLoading, $ionicSideMenuDelegate, $compile, $filter, Auth, Incidents, Messages, Upload, $firebaseArray, $cordovaCamera) {

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
        style: google.maps.ZoomControlStyle.DEFAULT,
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
      styles: [{
        featureType: "poi.business",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#e0efef"
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{
          "visibility": "on"
        }, {
          "hue": "#1900ff"
        }, {
          "color": "#c0e8e8"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "lightness": 100
        }, {
          "visibility": "simplified"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
          "visibility": "on"
        }, {
          "lightness": 700
        }]
      }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
          "color": "#7dcdcd"
        }]
      }]
    };

    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

    $scope.map = map;
    $scope.populateIncidentTypes();
    $scope.getIncidents();
    $scope.setDateAndTime();

    google.maps.event.addListener(map, 'mousedown', function(event) {
      clearTimeout($scope.downTimer);
      $scope.downTimer = setTimeout(function() {
        $scope.placeMarker(event.latLng);
      }, 1000);
    });

    google.maps.event.addListener(map, 'mouseup', function(event) {
      clearTimeout($scope.downTimer);
    });

    google.maps.event.addListener(map, 'drag', function(event) {
      clearTimeout($scope.downTimer);
    });
  }
  
  google.maps.event.addDomListener(window, 'load', initialize);

  $scope.incidentTypes = [];
  $scope.incidentTypeNames = {};
  $scope.incidents = {};
  $scope.renderedIncidents = {};
  $scope.mapBounds = {};
  $scope.newMessage = '';

  $scope.setMapBounds = function () {
    var bounds = $scope.map.getBounds();
    var northEastBound = bounds.getNorthEast();
    var southWestBound = bounds.getSouthWest();
    $scope.mapBounds.minLat = southWestBound.A;
    $scope.mapBounds.maxLat = northEastBound.A;
    $scope.mapBounds.minLon = southWestBound.F;
    $scope.mapBounds.maxLon = northEastBound.F;
  };

  google.maps.event.addDomListener(window, 'load', initialize);

  $scope.incidentTypes = [];
  $scope.incidentTypeNames = {};
  $scope.incidents = {};
  $scope.renderedIncidents = {};
  $scope.mapBounds = {};
  $scope.currentIncident;

  $scope.setMapBounds = function() {
    var bounds = $scope.map.getBounds();
    var northEastBound = bounds.getNorthEast();
    var southWestBound = bounds.getSouthWest();
    $scope.mapBounds.minLat = southWestBound.A;
    $scope.mapBounds.maxLat = northEastBound.A;
    $scope.mapBounds.minLon = southWestBound.F;
    $scope.mapBounds.maxLon = northEastBound.F;
  };

  $scope.getIncidents = function() {
    Incidents.getAllIncidents().then(function(result) {
      result[0].forEach(function(incident) {
        $scope.incidents[incident.id] = incident;
      })
      $scope.renderAllIncidents();
    });
  };

  $scope.renderAllIncidents = function() {
    var keys = Object.keys($scope.incidents);
    for (var i = 0; i < keys.length; i++) {
      if ($scope.renderedIncidents[keys[i]] === undefined) {
        $scope.renderIncident($scope.incidents[keys[i]],keys[i]);
        $scope.renderedIncidents[keys[i]] = true;
      }
    }
  };

  $scope.infoWindows = [];

  $scope.postMessage = function(message) {
    console.log(message);
  }

  $scope.renderIncident = function(incidentObj, ki) {
    var incidentPos = new google.maps.LatLng(incidentObj.latitude, incidentObj.longitude);
    var incidentIcon = "./img/" + incidentObj.iconFilename;
    var incident = new google.maps.Marker({
      position: incidentPos,
      map: $scope.map,
      icon: incidentIcon
    });

    var incidentInfoWindowContent = '<div class="incidentInfoTitle"> <strong>' + incidentObj.type + '</strong> on ' + incidentObj.fuzzyAddress + ' </div>' + 
    '<div class="incidentInfoDescription"> ' + 'User Description: <strong>' + incidentObj.description + '</strong> </div>' + 
    '<div class="incidnetInfoUsername"> ' + 'Reported by <strong>' + incidentObj.username + '</strong> to have occured on <strong>' + incidentObj.occurred_at.slice(0,10) + "</strong> at " +  incidentObj.occurred_at.slice(11,19) + '</div>' +
    '<div class="incidentInfoComments">';

    for (var comment in incidentObj.comments) incidentInfoWindowContent += '<div class="incidentInfoComment"' + incidentObj.comments[comment] + '</div>';
    incidentInfoWindowContent += '</div><input class="incidentInfoToComment" type="text" ng-model="newMessage" placeholder="Shiet!">' + 
                                 '<button ng-click="postMessage(newMessage)" class="button button-block button-calm">Comment</button>';

    var incidentInfoWindow;

    google.maps.event.addListener(incident, 'click', function() {
      $scope.currentIncident = incidentObj;
      $scope.currentIncident.date = $scope.currentIncident.occurred_at.slice(0,10);
      $scope.currentIncident.time = $scope.currentIncident.occurred_at.slice(11,19);
      $scope.currentIncident.pictures = ['data:image/jpeg;base64,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', 'data:image/jpeg;base64,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']
      console.log($scope.currentIncident);
       $scope.infoWindows.forEach(function(window) {
         window.close();
       });
       // incidentInfoWindow = new google.maps.InfoWindow({
       //   content: incidentInfoWindowContent
       // });
       // $scope.infoWindows.push(incidentInfoWindow);
       // incidentInfoWindow.open($scope.map,incident);
       $scope.incidentPopupModal.show();
     });
  };

  $scope.populateIncidentTypes = function () {
    Incidents.getIncidentTypes().then(function (result) {
      $scope.incidentTypes = result;
      result.forEach(function (incidentType) {
        $scope.incidentTypeNames[incidentType.type] = incidentType.id;
      });
    });
  };

  $scope.setDateAndTime = function() {
    var incidentDate = document.getElementsByClassName('incidentDate')[0];
    var incidentTime = document.getElementsByClassName('incidentTime')[0];
    incidentDate.value = $filter("date")(Date.now(), 'yyyy-MM-dd');
    incidentTime.value = $filter("date")(Date.now(), 'HH:mm');
  };

  // TODO Change this to current time rather than being hard coded
  // var today = new Date();
  $scope.newIncident = {};
  $scope.newIncident.curDate = "";
  $scope.newIncident.curTime = "";
  $scope.newIncidentType;

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
  $scope.newIncidentMarker;

  $scope.placeMarker = function(location) {

    if (!$scope.newIncidentMarker) {
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

  $scope.confirmIncidentCreate = function() {
    if (Auth.isAuthenticated()) {
      $scope.incidentReportForm.hidden = false;
    } else {
      $scope.openSignInModal();
    }
  };

  $scope.revealConfirmCancel = function() {
    $scope.createIncidentButton.hidden = false;
    $scope.cancelIncidentButton.hidden = false;
    $scope.$apply();
  };

  $scope.hideConfirmCancel = function() {
    $scope.createIncidentButton.hidden = true;
    $scope.cancelIncidentButton.hidden = true;
    $scope.incidentReportForm.hidden = true;
  };

  $scope.removeIncident = function() {
    $scope.newIncidentMarker.setMap(null);
    $scope.newIncidentMarker = false;
    $scope.hideConfirmCancel();
  };

  $scope.userIncident = {
    location: "",
    latitude: "",
    longitude: "",
    fuzzyAddress: ""
  };

  $scope.submitIncident = function(incident) {
    $scope.loading = $ionicLoading.show({
      content: 'Submitting New Incident...',
      showBackdrop: false
    });
    var dbIncident = {};
    // $scope.removeIncident();
    dbIncident.description = incident.description;
    dbIncident.incidentTypeId = $scope.incidentTypeNames[$scope.newIncidentType];

    if (incident.curDate === "") {
      incident.curDate = new Date();
    }
    if (incident.curTime === "") {
      incident.curTime = new Date();
    }
    dbIncident.occurred_at = incident.curDate.toISOString().slice(0, 10) + " " + incident.curTime.toTimeString().slice(0, 8);
    dbIncident.latitude = $scope.userIncident.latitude;
    dbIncident.longitude = $scope.userIncident.longitude;
    dbIncident.description = incident.description;
    if (incident.picFile){
      var picFile = incident.picFile[0];
    }

    $scope.reverseGeo($scope.userIncident.location, function() {
      // TODO Figure out if we can reverseGeo the real address...placeholder for now.
      dbIncident.address = $scope.userIncident.fuzzyAddress;
      dbIncident.fuzzyAddress = $scope.userIncident.fuzzyAddress;
      Incidents.createNewIncident(dbIncident).then(function(newIncident) {
        //upload to firebase
        console.log('incident obj', newIncident);
        var incidentID = newIncident.id;

        if(picFile){
          $scope.uploadImage(picFile, '1');
        }

        $scope.removeIncident();
        $scope.getIncidents();
        $scope.renderAllIncidents();
        $scope.loading.hide();
      });
    });
  };

  $scope.uploadImage = function(imageData, incidentID) {
    var FR = new FileReader();
    FR.onload = function(e) {
      var imageString = e.target.result;

      // $scope.images = [];
      var eventReference = fb.child("events/" + incidentID);
      var syncArray = $firebaseArray(eventReference.child("images"));

      $scope.images = syncArray;

      syncArray.$add({
        image: imageString}).then(function() {
        alert("Image has been uploaded");
      });
    };
    FR.readAsDataURL(imageData);

  };

  $scope.reverseGeo = function(location, next) {
    $scope.geoCoder.geocode({
      'latLng': location
    }, function(result, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        $scope.userIncident.address = result[0].formatted_address;
        $scope.userIncident.fuzzyAddress = result[1].formatted_address;
        next();
      } else {
        console.log("Error Retrieving Address");
      }
    });
  };

  $scope.centerMapOnUser = function() {
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function(error) {
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

  $ionicModal.fromTemplateUrl('templates/incidentpopup.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal) {
    $scope.incidentPopupModal = modal;
  });

  $scope.profileActivate = function() {
    if (Auth.isAuthenticated()) {
      $scope.user = Auth.getUser();
      $scope.profileModal.show();
    } else {
      $scope.signInModal.show();
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
    $scope.signUpModal.hide();
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

  // camera functions going here

  $scope.takePicture = function() {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // An error occured. Show a message to the user
      alert('error');
    });
  }

  // camera functions end

  $scope.isValidPhoneNumber = function(number) {
    return number ? number.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/) : false;
  };

  $scope.isValidEmail = function(email) {
    return email ? email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) : false;
  };
});
