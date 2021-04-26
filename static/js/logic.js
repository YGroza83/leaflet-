function createMap(bikeStations) {
// Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 10,
    id: "light-v10",
    accessToken: API_KEY
  });
  var baseMaps = {"Light Map": lightmap};
  var overlayMaps = {"Earthquakes": bikeStations};
  var map = L.map("map-id", { // Create the map object with options
    center: [35.22, -80.84],  //Charlotte, NC
    zoom: 4,
    layers: [lightmap, bikeStations] //Layer control for bonus start - overlays that can be turned on and off
  });
// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(map);
}
function createMarkers(earthquakeData) {
  function markerSize(mag) {return(mag*5)} //Prep marker size
  function markerColor(mag) {              //Prep marker color
    if (mag <= 2) {return("green");} 
    else if ((mag > 2 ) && (mag <= 3)) {return("blue");} 
    else if ((mag > 3) && (mag <= 4)) {return("orange");} 
    else if ((mag > 4) && (mag <= 5)) {return("darkorange");} 
    else {return("red");};
  }
  function popUp(feature, layer) { //Prep popup for marker
    layer.bindPopup(feature.properties.mag+"ML<br>"+new Date(feature.properties.time)+"<hr>"+(feature.properties.place));
  }
  function getCircleMarkers(feature, latlng) { //Asemble markers
    return new L.CircleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        color: markerColor(feature.properties.mag),
    });
  }
  var earthquakes = L.geoJSON(earthquakeData, { //Create markers
    onEachFeature: popUp,
    pointToLayer: getCircleMarkers
  });
  createMap(earthquakes); // Create a layer group made from the bike markers array, pass it into the createMap function
}
// get earthquakes data then call markers creation
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson", function(data) {
    createFeatures(data.features);
  }).then(createMarkers);