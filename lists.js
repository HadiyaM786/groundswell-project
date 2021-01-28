let orgs = true;
let keyword = null;
let lastKeyword = null;
let lastMarker = null;
let more = false;

function sortByDistance(coords, orgs) {
  let list = null;

  if (orgs) {
    list = document.getElementById("orgs-list")
  } else {
    list = document.getElementById("events-list")
  }

  list.childNodes.forEach(function (listing) {
    listing.dataDistance = turf.distance(coords, listing.dataCoords);
  });

  Array.from(list.childNodes).sort(function (a, b) {
    if (a.dataDistance > b.dataDistance) {
      return 1;
    }
    if (a.dataDistance < b.dataDistance) {
      return -1;
    }
    return 0;
  }).forEach(listing => {
    list.appendChild(listing);
  });

}

function listing(location, orgs) {
  if (orgs) {
    const orgsList = document.getElementById("orgs-list");

    const listing = orgsList.appendChild(document.createElement("div"));
    listing.className = "listing";
    listing.dataCoords = location.geometry.coordinates;
    listing.dataset.areasOfWork = location.properties[config.AREAS_OF_WORK].toLowerCase();
    listing.dataset.helpNeeded = location.properties[config.HELP_NEEDED].toLowerCase();
    listing.dataset.id = location.properties.Id;

    const picture = listing.appendChild(document.createElement("div"));
    picture.className = "listing-pic";
    if (location.properties["Picture"]) {
      picture.style.backgroundImage = "url('" + location.properties["Picture"] + "')";
    } else {
      picture.style.backgroundImage = "url('images/fists.jpg')";
    }

    const right = listing.appendChild(document.createElement("div"));
    right.className = "listing-right";

    const top = right.appendChild(document.createElement("div"));
    top.className = "listing-top";
    const title = top.appendChild(document.createElement("span"));
    title.className = "listing-title";
    title.innerText = location.properties["Name"];
    const areas = top.appendChild(document.createElement("span"));
    areas.className = "listing-areas";
    let words = location.properties[config.AREAS_OF_WORK].split(",");
    words.map(word => {
      const category = areas.appendChild(document.createElement("span"));
      category.className = "category";
      category.innerText = word;
    })

    const description = right.appendChild(document.createElement("div"));
    description.className = "listing-description";
    description.innerText = location.properties["Description 1"];

    listing.addEventListener("click", function () {
      showLocation(location);
    });

  } else {
    const eventsList = document.getElementById("events-list");

    const listing = eventsList.appendChild(document.createElement("div"));
    listing.className = "listing";
    listing.dataCoords = location.geometry.coordinates;
    listing.dataset.areasOfWork = location.properties[config.AREAS_OF_WORK].toLowerCase();
    listing.dataset.helpNeeded = location.properties[config.HELP_NEEDED].toLowerCase();
    listing.dataset.id = location.properties.Id;

    const picture = listing.appendChild(document.createElement("div"));
    picture.className = "listing-pic";
    if (location.properties["Picture"]) {
      picture.style.backgroundImage = "url('" + location.properties["Picture"] + "')";
    } else {
      picture.style.backgroundImage = "url('images/fists.jpg')";
    }

    const right = listing.appendChild(document.createElement("div"));
    right.className = "listing-right";

    const top = right.appendChild(document.createElement("div"));
    top.className = "listing-top";

    const left = top.appendChild(document.createElement("div"));

    const title = left.appendChild(document.createElement("span"));
    title.className = "listing-title";
    title.innerText = location.properties["Name"];

    const rightright = top.appendChild(document.createElement("div"));
    rightright.className = "events-listing-right-right";

    const areas = rightright.appendChild(document.createElement("div"));
    areas.className = "listing-areas";
    let words = location.properties[config.AREAS_OF_WORK].split(",");
    words.map(word => {
      const category = areas.appendChild(document.createElement("span"));
      category.className = "category";
      category.innerText = word;
    })

    const when = left.appendChild(document.createElement("div"));
    when.className = "events-listing-when";
    let array = location.properties["Start"].split("-");
    let year = array[0];
    let month = months[parseInt(array[1])-1];
    let day = array[2];
    let hour = array[3];
    let minute = array[4];
    if (minute === "0") {
      minute = "00";
    }

    let endArray = location.properties["End"].split("-");
    let endYear = endArray[0];
    let endMonth = months[parseInt(endArray[1])-1];
    let endDay = endArray[2];
    let endHour = endArray[3];
    let endMinute = endArray[4];
    if (endMinute === "0") {
      endMinute = "00";
    }

    let date = day + " " + month + " " + year;
    let endDate = endDay + " " + endMonth + " " + endYear;

    let string = null;

    if (date === endDate) {
      string = date + " " + hour + ":" + minute + " - " + endHour + ":" + minute;
    } else if (year === endYear) {
      string = day + " " + month + " - " + endDate;
    } else {
      string = date + " - " + endDate;
    }

    when.innerText = string;

    const description = right.appendChild(document.createElement("div"));
    description.className = "listing-description event-listing-description";
    description.innerText = location.properties["Description 1"];

    listing.addEventListener("click", function () {
      showLocation(location);
    });
  }

}

function allListings(orgs) {
  if (orgs) {
    document.getElementById("orgs-list").style.display = "block";
  } else {
    document.getElementById("events-list").style.display = "block";
  }
}

function selectedListing(location) {

  document.getElementById("selected-pic").style.display = "block";
  if (location.properties["Picture"]) {
    document.getElementById("selected-pic").style.backgroundImage = "url('" + location.properties["Picture"] + "')";
  } else {
    document.getElementById("selected-pic").style.backgroundImage = "url('images/fists-big.jpg')";
  }

  document.getElementById("selected-title").innerText = location.properties["Name"];
  const areas = document.getElementById("selected-specialisations");
  areas.textContent = "";
  let words = location.properties[config.AREAS_OF_WORK].split(",");
  words.map(word => {
    const category = areas.appendChild(document.createElement("span"));
    category.className = "category";
    category.innerText = word;
  })


  if (location.properties[config.HELP_NEEDED]) {
    document.getElementById("selected-help").style.display = "block";
    const areas = document.getElementById("selected-help-categories");
    areas.textContent = "";
    let words = location.properties[config.HELP_NEEDED].split(",");
    words.map(word => {
      const category = areas.appendChild(document.createElement("span"));
      category.className = "category";
      category.innerText = word;
    })
  } else {
    document.getElementById("selected-help").style.display = "none";
  }


  if (location.properties["Start"]) {
    document.getElementById("when").style.display = "block";

    let array = location.properties["Start"].split("-");
    let year = array[0];
    let month = months[parseInt(array[1])-1];
    let day = array[2];
    let hour = array[3];
    let minute = array[4];
    if (minute === "0") {
      minute = "00";
    }

    let endArray = location.properties["End"].split("-");
    let endYear = endArray[0];
    let endMonth = months[parseInt(endArray[1])-1];
    let endDay = endArray[2];
    let endHour = endArray[3];
    let endMinute = endArray[4];
    if (endMinute === "0") {
      endMinute = "00";
    }

    let date = day + " " + month + " " + year;
    let endDate = endDay + " " + endMonth + " " + endYear;

    let string = null;

    if (date === endDate) {
      string = date + " " + hour + ":" + minute + " - " + endHour + ":" + minute;
    } else if (year === endYear) {
      string = day + " " + month + " - " + endDate;
    } else {
      string = date + " - " + endDate;
    }

    document.getElementById("when").innerText = string;

    document.getElementById("instagram").style.display = "none";
    document.getElementById("website").style.display = "none";
    document.getElementById("twitter").style.display = "none";

    if (location.properties["Eventbrite"]) {
      document.getElementById("eventbrite").style.display = "flex";
      const link = document.getElementById("eventbrite").getElementsByTagName("a")[0];
      link.href = location.properties["Eventbrite"];
      link.innerHTML = location.properties["Eventbrite"];
    } else {
      document.getElementById("eventbrite").style.display = "none";
    }

    if (location.properties["Facebook"]) {
      document.getElementById("facebook").style.display = "flex";
      const link = document.getElementById("facebook").getElementsByTagName("a")[0];
      link.href = location.properties["Facebook"];
      link.innerHTML = location.properties["Facebook"];
    } else {
      document.getElementById("facebook").style.display = "none";
    }

      document.getElementById("selected-description").innerHTML = "<p>" +
      location.properties["Description 1"] + "</p><p>" +
      location.properties["Description 2"] + "</p>";

  } else {

    document.getElementById("when").style.display = "none";
    document.getElementById("eventbrite").style.display = "none";

    if (location.properties["Website"]) {
      document.getElementById("website").style.display = "flex";
      const link = document.getElementById("website").getElementsByTagName("a")[0];
      link.href = location.properties["Website"];
      link.innerHTML = location.properties["Website"];
    } else {
      document.getElementById("website").style.display = "none";
    }

    if (location.properties["Facebook"]) {
      document.getElementById("facebook").style.display = "flex";
      const link = document.getElementById("facebook").getElementsByTagName("a")[0];
      link.href = location.properties["Facebook"];
      link.innerHTML = location.properties["Facebook"];
    } else {
      document.getElementById("facebook").style.display = "none";
    }

    if (location.properties["Instagram"]) {
      document.getElementById("instagram").style.display = "flex";
      const link = document.getElementById("instagram").getElementsByTagName("a")[0];
      link.href = location.properties["Instagram"];
      link.innerHTML = location.properties["Instagram"];
    } else {
      document.getElementById("instagram").style.display = "none";
    }

    if (location.properties["Twitter"]) {
      document.getElementById("twitter").style.display = "flex";
      const link = document.getElementById("twitter").getElementsByTagName("a")[0];
      link.href = location.properties["Twitter"];
      link.innerHTML = location.properties["Twitter"];
    } else {
      document.getElementById("twitter").style.display = "none";
    }

    document.getElementById("selected-description").innerHTML = "<p>" +
    location.properties["Description 1"] + "</p><p>" +
    location.properties["Description 2"] + "</p>";
  }

  document.getElementById("selected").scrollTop = 0;
  document.getElementById("lists").scrollTop = 0;
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
