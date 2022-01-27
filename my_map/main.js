// Step 1: create the "map" object
// -------------------------------
mapboxgl.accessToken =
  "pk.eyJ1IjoiZHZycGNvbWFkIiwiYSI6ImNrczZlNDBkZzFnOG0ydm50bXR0dTJ4cGYifQ.VaJDo9EtH2JyzKm3cC0ypA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v10",
  center: [-75.16362, 39.95238],
  zoom: 9.5,
});

// Step 2: add data sources and layers to the map after initial load
// -----------------------------------------------------------------

map.on("load", () => {
  // LOAD DATA: add vector tileset from DVRPC's server
  map.addSource("sidewalk-tiles", {
    type: "vector",
    url: "https://www.tiles.dvrpc.org/data/pedestrian-network.json",
    minzoom: 8,
  });

  // LOAD DATA: add geojson layer from SEPTA's open data portal
  map.addSource("regional-rail-line-geojson", {
    type: "geojson",
    data: "https://opendata.arcgis.com/datasets/48b0b600abaa4ca1a1bacf917a31c29a_0.geojson",
  });

  // ADD LAYER: add two TAZ layers, one as a "fill" the other as a "line"

  map.addLayer({
    id: "taz-outline",
    type: "line",
    source: "sidewalk-tiles",
    "source-layer": "TAZ_2010",
    paint: {
      "line-width": 0.8,
      "line-opacity": 0.2,
      "line-color": "black",
    },
  });

  // ADD LAYER: add regional rail layer as a line
  map.addLayer({
    id: "rr-lines",
    type: "line",
    source: "regional-rail-line-geojson",
    paint: {
      "line-width": 3,
      "line-opacity": 1,
      "line-color": "black",
    },
  });
});
