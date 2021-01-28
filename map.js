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
  selectedMarker(location);
  selectedListing(location);
  selectedViewToggles();
  lastLocation = location;
}

function flyTo(location) {
  let shifted = null;

  if (window.innerWidth > config.BREAKPOINT) {
    shifted = [location.geometry.coordinates[0] - 0.031, location.geometry.coordinates[1]];
  } else {
    shifted = [location.geometry.coordinates[0], location.geometry.coordinates[1] - 0.013];
  }

  if (location.geometry) {
    map.flyTo({
      center: shifted,
      zoom: 12,
    });
  }
}


function selectedMarker(location) {
  if (lastMarker) {
    lastMarker.classList.remove("selected-marker");
  }

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
  const container = document.getElementsByClassName("mapboxgl-ctrl-attrib-inner")[0];
  const mine = document.createElement("div");
  container.insertBefore(mine, container.firstChild);
  mine.className = "mine";
  mine.innerHTML = "Built by <a href='https://cleanpower.london'>cleanpower.london</a> ";
});
