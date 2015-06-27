angular.module('watchly.directives', [])

.directive('map', function () {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {
        // Broadcast initialize event
        ionic.EventController.trigger('initialize');

        // Set Map Options
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
          styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
        };

        var map = new google.maps.Map($element[0], mapOptions);
        
        // Stub marker instanitation

        var pedHazard = new google.maps.Marker({
          position: {lat: 37.783568, lng: -122.408840},
          map: map,
          icon: "./img/ped_hazard.png",
          title: "STUB_DRUG"
        });

        var drugMarker = new google.maps.Marker({
          position: {lat: 37.783806, lng:  -122.408490},
          map: map,
          icon: "./img/drug_use.png",
          title: "STUB_DRUG2"
        });

        var potholeMarker = new google.maps.Marker({
          position: {lat: 37.783844, lng: -122.409239},
          map: map,
          icon: "./img/road_hazard.png",
          title: "STUB_ROAD_HAZARD"
        });

        var potholeMarker2 = new google.maps.Marker({
          position: {lat: 37.783225, lng: -122.409102},
          map: map,
          icon: "./img/road_hazard.png",
          title: "STUB_ROAD_HAZARD2"
        });

        var graffitiMarker = new google.maps.Marker({
          position: {lat: 37.783901, lng: -122.409126},
          map: map,
          icon: "./img/vandalism.png",
          title: "STUB_GRAFFITI"
        });

        $scope.onCreate({map: map});

        // Stop the side bar from dragging when mousedown on the map
        // google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
        //   e.preventDefault();
        //   return false;
        // });

        // Marker listener on click after 2 seconds
        var downTimer;

        google.maps.event.addListener(map, 'mousedown', function (event) {
          console.log("heard  mousedown");
          clearTimeout(downTimer);
          downTimer = setTimeout(function () {
            placeMarker(event.latLng);
          }, 1500);
        });

        google.maps.event.addListener(map, 'mouseup', function (event) {
          clearTimeout(downTimer);
        });

        var newIncident;

        var placeMarker = function (location) {
          if (!newIncident) {
            ionic.EventController.trigger('createIncident');
            newIncident = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: location,
                map: map,
                icon: {
                  url: "./img/other.png",
                  size: new google.maps.Size(25, 25)
                }
              });
          }
        }

        ionic.EventController.on('removeIncident', function () {
          console.log("Heard removeIncident");
          newIncident.setMap(null);
          newIncident = false;
        }, $scope.map);
      }


      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  };
});
