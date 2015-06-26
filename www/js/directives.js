angular.module('watchly.directives', [])

.directive('map', function () {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {

        // Marker Stubs

        var testDealer = {
          pos: {lat: 37.783568, lng: -122.408840},
          img: "./img/ped_hazard.png",
          title: "STUB_DRUG"
        };

        var testDealer2 = {
          pos: {lat: 37.783806, lng:  -122.408490},
          img: "./img/drug_use.png",
          title: "STUB_DRUG2"
        };

        var testHazard = {
          pos: {lat: 37.783844, lng: -122.409239},
          img: "./img/road_hazard.png",
          title: "STUB_ROAD_HAZARD"
        };

        var testHazard2 = {
          pos: {lat: 37.783225, lng: -122.409102},
          img: "./img/road_hazard.png",
          title: "STUB_ROAD_HAZARD2"
        };

        var testGraffiti = {
          pos: {lat: 37.783901, lng: -122.409126},
          img: "./img/vandalism.png",
          title: "STUB_GRAFFITI"

        };

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
            position: google.maps.ControlPosition.TOP_LEFT
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
        };

        var map = new google.maps.Map($element[0], mapOptions);
        
        // Stub marker instanitation

        var drugMarker = new google.maps.Marker({
          position: testDealer.pos,
          map: map,
          icon: testDealer.img,
          title: testDealer.title

        });

        var drugMarker2 = new google.maps.Marker({
          position: testDealer2.pos,
          map: map,
          icon: testDealer2.img,
          title: testDealer2.title
        });

        var potholeMarker = new google.maps.Marker({
          position: testHazard.pos,
          map: map,
          icon: testHazard.img,
          title: testHazard.title
        });

        var potholeMarker2 = new google.maps.Marker({
          position: testHazard2.pos,
          map: map,
          icon: testHazard2.img,
          title: testHazard2.title
        });

        var graffitiMarker = new google.maps.Marker({
          position: testGraffiti.pos,
          map: map,
          icon: testGraffiti.img,
          title: testGraffiti.title,
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

        // var newIncident;

        function placeMarker(location) {
          // if (!newIncident) {
          if (true) {
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
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  };
});
