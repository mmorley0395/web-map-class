// Step 1: create the "map" object
// -------------------------------
mapboxgl.accessToken =
  "pk.eyJ1IjoiZHZycGNvbWFkIiwiYSI6ImNrczZlNDBkZzFnOG0ydm50bXR0dTJ4cGYifQ.VaJDo9EtH2JyzKm3cC0ypA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/dvrpcomad/ckz2yw8nu000y14mkkuzicgwn",
  center: [-75.16362, 39.95238],
  zoom: 9.5,
});

var data = {
  labels: ["Mouse", "Pig", "House"],
  datasets: [
    {
      label: "Dataset #1",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: [1, 2, 3],
    },
  ],
};

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}
map.on("load", () => {
  // LOAD DATA: add vector tileset from DVRPC's server

  map.addSource("rtsp_tile", {
    type: "vector",
    url: "https://www.tiles.dvrpc.org/data/rtps-reliability.json",
    minzoom: 8,
  });

  map.addLayer({
    id: "rtsp",
    type: "line",
    source: "rtsp_tile",
    "source-layer": "otp",
    paint: {
      "line-width": 3,
      "line-opacity": 1,
      "line-color": {
        property: "otp",
        stops: [
          [60, "red"],
          [70, "orange"],
          [80, "yellow"],
          [90, "green"],
          [100, "light blue"],
        ],
      },
    },
  });

  // Add a popup to the map when the user mouses over a RR line
  map.on("mouseenter", "rtsp", (e) => {
    // get the attributes for the specific feature under the mouse
    let properties = e.features[0].properties;
    let otp = properties["otp"];
    let line = properties["linename"];
    let message = `
      <ul>
        <h3><span class="bolded">Route ${line}</span> is on time ${otp}% of the time</h3>
      </ul>
    `;

    // create the popup and add it to the map
    let popup = new mapboxgl.Popup({
      closeButton: false,
      className: "popup-style",
    });

    popup.setLngLat(e.lngLat).setHTML(message).addTo(map);
  });

  // Remove popup from the map when the user's mouse is no longer
  // hovering over a RR lineß
  map.on("mouseleave", "rtsp", (e) => {
    // get all HTML elements with the class name 'popup-style'
    let popup = document.getElementsByClassName("popup-style");

    // remove all elements with this class name
    if (popup.length) {
      popup[0].remove();
    }
  });

  map.on("click", "rtsp", (e) => {
    console.log(data.labels);
    removeData(chart);
    console.log(data);
    // let properties = e.features[0].properties;
    // let otp = properties["otp"];
    // let line = properties["linename"];
    // addData(chart, line, otp);
    // console.log(data);
    // chart.update();
  });
});

var options = {
  maintainAspectRatio: false,
  scales: {
    y: {
      stacked: true,
      grid: {
        display: true,
        color: "rgba(255,99,132,0.2)",
      },
    },
    x: {
      grid: {
        display: true,
      },
    },
  },
};

new Chart("chart", {
  type: "doughnut",
  options: options,
  data: data,
});
