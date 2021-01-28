let areasOfWork = [];
let helpNeeded = [];
let areasOfWorkShowing = [];
let helpNeededShowing = [];

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

function formatFilters() {
  let areasFilters = document.getElementById("areas-filters");
  let helpFilters = document.getElementById("help-filters");

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
      let button = areasFilters.appendChild(document.createElement("div"));
      button.innerText = area;
      button.className = "area-filter";
      button.addEventListener("click", function(e) {
        button.classList.toggle("work-filter-selected");
        toggleAreasFilter(area);
      });
    }
  })

  helpNeeded.map(area => {
    if (!firstHelpLoad.includes(area)) {
      let button = helpFilters.appendChild(document.createElement("div"));
      button.innerText = area;
      button.className = "help-filter";
      button.addEventListener("click", function() {
        button.classList.toggle("help-filter-selected");
        toggleHelpFilter(area);
      });
    }
  })

  firstWorkLoad = [...areasOfWork];
  firstHelpLoad = [...helpNeeded];

  _showDefaults();

}
