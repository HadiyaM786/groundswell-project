var selectedMark;
var newMark;


mapboxgl.accessToken = config.MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: config.MAP_STYLE,
  center: config.MAP_CENTER,
  zoom: 10,
  
}); 

let locationMarker = document.createElement("div");
locationMarker.className = "location-marker";

(function addGeocoder() {
  let locationMarker = document.createElement("div");
  locationMarker.className = "location-marker";

  const geocoder = new MapboxGeocoder({
    accessToken: config.MAPBOX_TOKEN,
    mapboxgl: mapboxgl,
    marker: {
    element: locationMarker,
    },
  });

  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
  document.getElementsByClassName("mapboxgl-ctrl-geocoder--input")[0].placeholder = "E.g. NW6 7QB, Manchester";
})();

function showLocation(location) {
  flyTo(location);
  //selectedMarker(location);
  showpopup(location);
  selectedListing(location);
  selectedViewToggles();
  lastLocation = location;
}

function flyTo(location) {
  let shifted = null;

  if (window.innerWidth > config.BREAKPOINT) {
    shifted = [location.geometry.coordinates[0] - 0.011, location.geometry.coordinates[1]];
  } else {
    shifted = [location.geometry.coordinates[0], location.geometry.coordinates[1] - 0.013];
  }

  if (location.geometry) {
    map.flyTo({
      center: shifted,
      zoom: 14,
    });
  }
}


function selectedMarker(location) {
  if (lastMarker) {
    lastMarker.classList.remove("selected-marker");
  }
debugger;
  let selectedMarker = null;

  if (orgs) {
    selectedMarker = document.getElementById("orgs"+location.properties.Id);
  } else {
    selectedMarker = document.getElementById("events"+location.properties.Id);
  }
  selectedMarker.classList.add("selected-marker");

  new mapboxgl.Popup({
    offset: 20,
    closeOnClick: true,
    closeButton: false,
  }).setLngLat(location.geometry.coordinates)
  .setHTML(location.properties.Name)
  .addTo(map); //don't know why i have to recreate this again

  lastMarker = selectedMarker;
}

function mapMarker(location, orgs) {
  let marker = document.createElement("div");
  if (orgs) {
    marker.className = "orgs-marker";
    marker.id = "orgs" + location.properties.Id;
  } else {
    marker.className = "events-marker";
    marker.id = "events" + location.properties.Id;
  }

  new mapboxgl.Marker({
      element: marker,
  }).setLngLat(location.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({
      offset: 20,
      closeButton: false,
      closeonClick: true,
      })
    .setHTML(location.properties.Name)) //this should be able to be deleted but why not?
  .addTo(map);

  marker.addEventListener("click", function(e) {
    showLocation(location);
  });
}

function clearPopup() {
  const popups = document.getElementsByClassName("mapboxgl-popup");
  if (popups[0]) popups[0].remove();
}

map.on('load', function() {
  map.loadImage('./images/maker.png', function (error, image){
    if (error) throw error;
    map.addImage('marker-icon', image, { 'sdf': false });
  });
  const container = document.getElementsByClassName("mapboxgl-ctrl-attrib-inner")[0];
  const mine = document.createElement("div");
  container.insertBefore(mine, container.firstChild);
  mine.className = "mine";
  mine.innerHTML = "Built by <a href='https://cleanpower.london'>cleanpower.london</a> ";
});


function initLayer(values){
var val=values;
map.addSource('earthquakes', {
type: 'geojson',
data:val,
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'earthquakes',
filter: ['has', 'point_count'],

paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
'circle-color': [
'step',
['get', 'point_count'],
'#38c0ff',
15,
'#3683ff',
25,
'#0363ff',
35,
'#003387',
45,
'#001f52'
],
'circle-stroke-color': [
  'step',
  ['get', 'point_count'],
  '#38c0ff',
  15,
  '#3683ff',
  25,
  '#0363ff',
  35,
  '#003387',
  45,
  '#001f52'
  ],
'circle-stroke-width':7,
'circle-stroke-opacity':0.4,
'circle-radius': [
'step',
['get', 'point_count'],
14,
107,
24,
757,
40
]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'earthquakes',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12,
},
paint: {
  "text-color": "#ffffff"
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'symbol',
source: 'earthquakes',
filter: ['!', ['has', 'point_count']],
'layout': {
  'icon-image': 'marker-icon',
  'icon-size': 0.5,
  },

});

  map.on('mouseenter', 'unclustered-point', function (e) {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('click', 'unclustered-point', function (e) {
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = 'pointer';
   
 var coordinates = e.features[0].geometry.coordinates.slice();
 var description =  e.features[0].properties['Name'];
 var location={};
 location.properties=e.features[0].properties;
 location.geometry=e.features[0].geometry;
 location.type='Feature';
 showLocation(location);
 
//selectedListing(location);
//selectedViewToggles();
 
 //var description = "hello world";
   
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  
  }
   
  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });
  // map.on('mouseleave', 'unclustered-point', function () {
  //   map.getCanvas().style.cursor = '';
  //   popup.remove();
  //   });
   
 
   

// inspect a cluster on click
map.on('click', 'clusters', function (e) {
var features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
var clusterId = features[0].properties.cluster_id;
map.getSource('earthquakes').getClusterExpansionZoom(
clusterId,
function (err, zoom) {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
});
}
);
}
function showpopup(location){
  
    var coordinates = location.geometry.coordinates.slice();
    var description =  location.properties['Name'];
    newMark=location.properties['Id'];
    if(!selectedMark){
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
        });
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
      selectedMark=newMark;
    }else if(selectedMark && selectedMark!=newMark){
      clearPopup();
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
        });
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
      selectedMark=newMark;
    }else if(selectedMark && selectedMark==newMark){
      clearPopup();
      selectedMark=null;
      newMark=null;

    }
    
}