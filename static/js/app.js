/*
var myMap = L.map("geoMap", {
  center: [31, 65],
  zoom: 2
});


// Adding tile layer to the map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 8,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

function globalTerrorismMap() {

	URL = "/api/geography";
	d3.json(URL, function(response) {

		var markers = L.markerClusterGroup();

		var geoJsonLayer = L.geoJson(response, {
			onEachFeature: function(feature, layer) {
				layer.bindPopup(feature.properties.target_type);
				layer.on("mouseover", function(e) {
					this.openPopup();
				});
				layer.on("mouseout", function(e) {
					this.closePopup();
				});
			}
		});

		markers.addLayer(geoJsonLayer);

		myMap.addLayer(markers);
		myMap.fitBounds(markers.getBounds());
	});
}

globalTerrorismMap()
*/

function getYearMap(year) {

	URL = "/api/geography/"+year;
	d3.json(URL, function(response) {
		createFeatures(response.features);
	})

	function createFeatures(yearData) {
		var markers = L.markerClusterGroup();

		var geoJsonLayer = L.geoJson(yearData, {
			onEachFeature: function(feature, layer) {
				layer.bindPopup("<strong>"+feature.properties.target_type+"</strong><br><b>"+feature.properties.attack_type+"</b>");
				layer.on("mouseover", function(e) {
					this.openPopup();
				});
				layer.on("mouseout", function(e) {
					this.closePopup();
				});
			}
		});

		markers.addLayer(geoJsonLayer);
		createMap(markers);

	}

	function createMap(yearLayer) {

		// Define streetmap and darkmap layers
		var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 8,
		id: "mapbox.streets",
		accessToken: API_KEY
		});

		var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 8,
		id: "mapbox.dark",
		accessToken: API_KEY
		});

		// Define a baseMaps object to hold our base layers
		var baseMaps = {
		"Street Map": streetmap,
		"Dark Map": darkmap
		};

		// Create overlay object to hold our overlay layer
		var overlayMaps = {
		Incidents: yearLayer
		};

		// Create our map, giving it the streetmap and earthquakes layers to display on load
		var myMap = L.map("geoMap", {
		center: [31, 65],
		zoom: 2,
		layers: [streetmap, yearLayer]
		});

		// Create a layer control
		// Pass in our baseMaps and overlayMaps
		// Add the layer control to the map
		L.control.layers(baseMaps, overlayMaps, {
		collapsed: false
		}).addTo(myMap);
	}
}

// View the current window to find what to query:
var current = window.location.href
if (current.slice(-4) === "000/") {
	console.log("homePage");
	getYearMap("2017")
} else {
	console.log(current.slice(-4));
	getYearMap(current.slice(-4));
}
