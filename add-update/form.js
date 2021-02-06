const config = {
  ORGS_URL: "https://docs.google.com/spreadsheets/d/1CqYHsnWnl46cD0tTqX30-ofDf5CK6tnfoxILz_-uy-E/gviz/tq?tqx=out:csv&sheet=Organisations",
  EVENTS_URL: "https://docs.google.com/spreadsheets/d/1CqYHsnWnl46cD0tTqX30-ofDf5CK6tnfoxILz_-uy-E/gviz/tq?tqx=out:csv&sheet=Events",
  LATITUDE_FIELD: "Latitude",
  LONGITUDE_FIELD: "Longitude",
  AREAS_OF_WORK: "Areas of Work",
  HELP_NEEDED: "Help Needed",
};

let areasOfWork = [];
let helpNeeded = [];

let firstWorkLoad = [];
let firstHelpLoad = [];

function collectFilters(location) {
  let categories1 = location.properties[config.AREAS_OF_WORK].split(",");
  categories1.map(category => {
    category = category.trim().toLowerCase();
    if (!(areasOfWork.includes(category)) && category !== "") {
      areasOfWork.push(category);
    }
  });

  let categories2 = location.properties[config.HELP_NEEDED].split(",");
  categories2.map(category => {
    category = category.trim().toLowerCase();
    if (!(helpNeeded.includes(category)) && category !== "") {
      helpNeeded.push(category);
    }
  });
}

function formatOptions() {
  let areasFieldset = document.getElementById("fieldset1");
  let helpFieldset = document.getElementById("fieldset2");

  // areasOfWork.sort((a,b) => {
  //   if (config.SHOW_FIRST.includes(a)) {
  //     return -1
  //   }
  //   else {
  //     return 1
  //   }
  // })
  //
  // helpNeeded.sort((a,b) => {
  //   if (config.SHOW_FIRST.includes(a)) {
  //     return -1
  //   }
  //   else {
  //     return 1
  //   }
  // })

  areasOfWork.map(area => {
    if (!firstWorkLoad.includes(area)) {
      let field = areasFieldset.appendChild(document.createElement("div"));
      field.className = "field filter";

      let input = field.appendChild(document.createElement("input"));
      input.type = "checkbox";
      input.id = area.replace(/\s+/g, '-').toLowerCase();
      input.value = area;

      let label = field.appendChild(document.createElement("label"));
      label.htmlFor = input.id;
      label.innerText = area;
    }
  })

  helpNeeded.map(area => {
    if (!firstHelpLoad.includes(area)) {
      let field = helpFieldset.appendChild(document.createElement("div"));
      field.className = "field filter";

      let input = field.appendChild(document.createElement("input"));
      input.type = "checkbox";
      input.id = area.replace(/\s+/g, '-').toLowerCase();
      input.value = area;

      let label = field.appendChild(document.createElement("label"));
      label.htmlFor = input.id;
      label.innerText = area;
    }
  })

  firstWorkLoad = [...areasOfWork];
  firstHelpLoad = [...helpNeeded];


}

(function orgsFromGoogleSheet() {
  const oReq = new XMLHttpRequest();

  let url = config.ORGS_URL;
  oReq.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
  oReq.send();

  oReq.onload = function(e) {
    csv2geojson.csv2geojson(oReq.responseText, {
      latfield: config.LATITUDE_FIELD,
      lonfield: config.LONGITUDE_FIELD,
      delimiter: ","
    }, function (err, geojson) {
      if (err) {
        console.log("Error with orgs data")
        console.error(err);
      }
      geojson.features.forEach(function (location, index) {
        collectFilters(location);
      });
      formatOptions();
    });
  };
})();

(function eventsFromGoogleSheet() {
  const oReq = new XMLHttpRequest();

  let url = config.EVENTS_URL;
  oReq.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
  oReq.send();

  oReq.onload = function(e) {
    csv2geojson.csv2geojson(oReq.responseText, {
      latfield: config.LATITUDE_FIELD,
      lonfield: config.LONGITUDE_FIELD,
      delimiter: ","
    }, function (err, geojson) {
      if (err) {
        console.log("Error with events data")
        console.error(err);
      }
      geojson.features.forEach(function (location, index) {
        collectFilters(location);
      });
      formatOptions();
    });
  };
})();


document.getElementById("add").addEventListener("click", function (e) {
  document.querySelectorAll(".asterisk").forEach(asterisk => {
    asterisk.style.display = "inline";
  });
});

document.getElementById("update").addEventListener("click", function (e) {
  document.querySelectorAll(".question").forEach(question => {
      if (question.id === "qAction" || question.id === "qOrgName" || question.id === "qEmail") {
        question.getElementsByClassName("asterisk")[0].style.display = "inline";
      } else {
        question.getElementsByClassName("asterisk")[0].style.display = "none";
      }
  })
});

function checkChange() {
  let street1 = document.getElementById("street1").value;
  let street2 = document.getElementById("street2").value;
  let city = document.getElementById("city").value;
  let postcode = document.getElementById("postcode").value;
  if (!street1 && !street2 && !city && !postcode) {
    document.getElementById("country").value = "";
  }
}
