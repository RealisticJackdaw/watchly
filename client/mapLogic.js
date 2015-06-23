// mapLogic.js

// Main Map
var map;

// Marker Stubs
var hackReactorLoc = {lat: 37.783726, lng: -122.408973};

var testDealer = {
  pos: {lat: 37.783568, lng: -122.408840},
  img: "./client/assets/drug.png",
  title: "STUB_DRUG"
};

var testDealer2 = {
  pos: {lat: 37.783806, lng:  -122.408490},
  img: "./client/assets/drug.png",
  title: "STUB_DRUG2"
};

var testHazard = {
  pos: {lat: 37.783844, lng: -122.409239},
  img: "./client/assets/hazard.png",
  title: "STUB_ROAD_HAZARD"
};

var testHazard2 = {
  pos: {lat: 37.783225, lng: -122.409102},
  img: "./client/assets/hazard.png",
  title: "STUB_ROAD_HAZARD2"
};

var testGraffiti = {
  pos: {lat: 37.783901, lng: -122.409126},
  img: "./client/assets/graffiti.png",
  title: "STUB_GRAFFITI"
};

// Init Main Map
var initialize = function() {

  // Set Main Map
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    // Starting Zoom
    zoom: 18,
    // Double Clicking to Zoom
    disableDoubleClickZoom: true,
    // Pegman Street View
    streetViewControl: false,
    // Zoom Control Bar
    zoomControl: true,
    zoomControlOptions: {
      // .SMALL, .LARGE, .DEFAULT
      style: google.maps.ZoomControlStyle.SMALL
    },
    // Cardinal Direction Controller
    panControl: false,
    // Map/Satellite View Switch
    mapTypeControl: false,
    mapTypeControlOptions: {
      // .HORIZONTAL_BAR, .DROPDOWN_MENU, .DEFAULT
      style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
    // Display scale control at bottom of map
    scaleControl: false,
    // Display map overview nav at bottom of map
    overviewMapControl: false,
    // Center on Hack Reactor
    center: hackReactorLoc
  });

  // Marker stubs
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
    draggable: true,
  });

};

// Map Listener
google.maps.event.addDomListener(window, 'load', initialize);
