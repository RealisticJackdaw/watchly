angular.module('watchly.controllers', ['watchly.services', 'ngFileUpload', 'ngCordova', 'firebase'])

.controller('MapCtrl', function($scope, $http, $ionicModal, $ionicLoading, $ionicSideMenuDelegate, $compile, $filter, Auth, Incidents, Messages, Upload, $firebaseArray, $cordovaCamera, $ionicSlideBoxDelegate) {

  function initialize() {
    Auth.loggedIn();
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

  $scope.setMapBounds = function() {
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
        $scope.renderIncident($scope.incidents[keys[i]], keys[i]);
        $scope.renderedIncidents[keys[i]] = true;
      }
    }
  };

  $scope.infoWindows = [];

  $scope.postMessage = function(message, currentIncident) {
    Messages.createNewMessage(JSON.stringify({
        description: message,
        userId: currentIncident.userId,
        incidentsId: currentIncident.id
     })).then(function(){
      Messages.getMessageByIncident(JSON.stringify($scope.currentIncident.id)).then(function(messages){
        $scope.currentIncident.messages = messages;
      })
    })
  }

  $scope.doRefresh = function() {
    Messages.getMessageByIncident(JSON.stringify($scope.currentIncident.id))
      .then(function(messages) {
        $scope.currentIncident.messages = messages;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.upvote = function(currentIncident){
    Incidents.upvote(currentIncident).then(function(newIncident){
      $scope.currentIncident.votes = newIncident.votes;
    });
  };

  $scope.downvote = function(currentIncident){
    Incidents.downvote(currentIncident).then(function(newIncident){
      $scope.currentIncident.votes = newIncident.votes;
    });
  };

  $scope.renderIncident = function(incidentObj, ki) {
    var incidentPos = new google.maps.LatLng(incidentObj.latitude, incidentObj.longitude);
    var incidentIcon = "./img/" + incidentObj.iconFilename;
    var incident = new google.maps.Marker({
      position: incidentPos,
      map: $scope.map,
      icon: incidentIcon
    });

    var incidentInfoWindow;

    google.maps.event.addListener(incident, 'click', function() {
      $scope.currentIncident = incidentObj;
      $scope.currentIncident.date = $scope.currentIncident.occurred_at.slice(0, 10);
      $scope.currentIncident.time = $scope.currentIncident.occurred_at.slice(11, 19);
      $scope.currentIncident.pictures = [];
      Messages.getMessageByIncident(JSON.stringify($scope.currentIncident.id)).then(function(messages){
        messages.forEach(function(message){
          Auth.getUsernameFromId(JSON.stringify(message.userId)).then(function(userName){
            message.userName = userName.username;
          })
        })
        $scope.currentIncident.messages = messages;
      })


      var eventReference = fb.child("events/" + $scope.currentIncident.id);
      var syncArray = $firebaseArray(eventReference.child("images"));
      syncArray.$loaded()
      .then(function(){
          angular.forEach(syncArray, function(image) {
            var orientation;
             if (image.orientation) {
                 orientation = image.orientation;
             }
             var oriClass = '';
             switch(orientation) {
              //home button up
               case 8:
                 oriClass = 'rotate270';
                 break;
               //home button right
                case 1:
                  oriClass = '';
                  break;
              //home button left
               case 3:
                 oriClass = 'rotate180';
                 break;
              //home button down
               case 6:
                 oriClass = 'rotate90';
                 break;
             }
             $scope.currentIncident.pictures.push({
               image:image.imageString,
               oriClass: oriClass
             });

          });
          $ionicSlideBoxDelegate.update();
        });
      $scope.infoWindows.forEach(function(window) {
        window.close();
      });
       $scope.infoWindows.forEach(function(window) {
         window.close();
       });

       $scope.incidentPopupModal.show();
     });
  };

  $scope.populateIncidentTypes = function () {
    Incidents.getIncidentTypes().then(function (result) {
      $scope.incidentTypes = result;
      result.forEach(function(incidentType) {
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
    dbIncident.votes = 0;
    dbIncident.description = incident.description;
    dbIncident.incidentTypeId = $scope.incidentTypeNames[incident.type];

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


    $scope.reverseGeo($scope.userIncident.location, function() {
      // TODO Figure out if we can reverseGeo the real address...placeholder for now.
      dbIncident.address = $scope.userIncident.fuzzyAddress;
      dbIncident.fuzzyAddress = $scope.userIncident.fuzzyAddress;
      Incidents.createNewIncident(dbIncident).then(function(newIncident) {
        //upload to firebase
        var incidentID = newIncident.id;

        if (incident.picFile) {
          for (var i = 0; i < incident.picFile.length; i++) {
            $scope.uploadImage(incident.picFile[i], incidentID);
          }
        }

        for(var index in $scope.newIncident) {
           if ($scope.newIncident.hasOwnProperty(index)) {
               $scope.newIncident[index] = null;
           }
        }

        $scope.removeIncident();

        $scope.getIncidents();
        $scope.renderAllIncidents();
        $scope.loading.hide();
      });
    });
  };

  $scope.uploadImage = function(imageData, incidentID) {
    loadImage.parseMetaData(
      imageData,
      function(data) {
        var orientation;
        if (data.exif) {
          orientation = data.exif.get('Orientation');
        } else {
          orientation = null;
        }
        console.log('image orientation: ',orientation);

        var FR = new FileReader();
        FR.onload = function(e) {
          var imageString = e.target.result;
          var image = new Image();
          image.onload = function(imageEvent) {
            var canvas = document.createElement('canvas'),
              max_size = 800, // TODO : pull max size from a site config
              width = image.width,
              height = image.height;
            if (width > height) {
              if (width > max_size) {
                height *= max_size / width;
                width = max_size;
              }
            } else {
              if (height > max_size) {
                width *= max_size / height;
                height = max_size;
              }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            var dataUrl = canvas.toDataURL('image/jpeg');

            var eventReference = fb.child("events/" + incidentID);
            var syncArray = $firebaseArray(eventReference.child("images"));

            $scope.user = Auth.getUser();
            var username = $scope.user.username || '';

            var submitDate = new Date().toISOString().slice(0, 10);

            syncArray.$add({
                imageString: dataUrl,
                username: username,
                submitDate: submitDate,
                orientation: orientation
              })
              .then(function() {
                console.log("Image has been uploaded");
              });
          };
          image.src = e.target.result;
        };
        FR.readAsDataURL(imageData);
      }, {}
    );
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

  $ionicModal.fromTemplateUrl('templates/databaseReset.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true,
  }).then(function(modal) {
    $scope.databaseResetModal = modal;
  });

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

  $ionicModal.fromTemplateUrl('templates/profileEditor.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal) {
    $scope.editProfileModal = modal;
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

  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
    $scope.signInRejected = false;

  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
    $scope.signInRejected = false;

  });

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

  $scope.openDatabaseResetModal = function() {
    $scope.databaseResetModal.show();
  };

  $scope.closeDatabaseResetModal = function() {
    $scope.databaseResetModal.hide();
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

  $scope.updateUser = function() {
    var data = JSON.stringify({oldUsername: $scope.user.username, user: $scope.newUser});

    Auth.updateUserProfile(data, function() {
      $scope.editProfileModal.hide();
      $scope.user.firstName = $scope.newUser.firstName || $scope.user.firstName;
      $scope.user.lastName = $scope.newUser.lastName || $scope.user.lastName;
      $scope.user.username = $scope.newUser.username || $scope.user.username;
      $scope.user.email = $scope.newUser.email || $scope.user.email;
      $scope.user.phone = $scope.newUser.phone || $scope.user.phone;
    });
  };

  $scope.profileEditor = function() {
    $scope.newUser = {};
    $scope.profileModal.hide();
    $scope.editProfileModal.show();
  };

  $scope.signUp = function(user) {
    Auth.signup(user).then(function(res) {
      $scope.closeSignUpModal();
    });
  };

  $scope.signIn = function(user) {
    $scope.signInRejected = false;

    if (user && user.username === 'reset') {
      $scope.resetDB();
      $scope.closeSignInModal();
      $scope.openDatabaseResetModal();
    } else {
      Auth.signin(user).then(function(res) {
          $scope.closeSignInModal();
        })
        .catch(function(err) {
          console.error('sign in error:', err);
          $scope.signInRejected = true;
        });
    }
  };

  $scope.resetDB = function() {
    Messages.resetMessageDB(function() {
      Incidents.resetIncidentDB(function() {
        Auth.resetUserDB();
      });
    });

    var eventReference = fb.child("events");
    eventReference.remove(function(error) {
      if (error) {
        console.error('firebase error: ', error);
      } else {
        console.log('firebase events removed');
      }
    });
  };

  $scope.signOut = function() {
    Auth.signout().then(function(res) {
      $scope.user = '';
      $scope.closeProfileModal();
    });
  };

  $scope.forgotPassword = function(email) {
    Auth.forgotpassword(email).then(function(res) {
      $scope.closeForgotPasswordModal();
    });
  };

  $scope.shareOnFacebook = function() {
    Incidents.shareOnFacebook();
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
  };

  // camera functions end

  $scope.isValidPhoneNumber = function(number) {
    return number ? number.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/) : false;
  };

  $scope.isValidEmail = function(email) {
    return email ? email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) : false;
  };
});
