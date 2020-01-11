const polyUtil = require("google-maps-polyutil");
const SphericalUtil = require("google-maps-polyutil/lib/SphericalUtil");
const dotenv = require("dotenv").config();
const googleMapsClient = require("@google/maps").createClient({
  key: process.env.APIKEY,
  Promise: Promise
});

/* Algorithm:
    Step 1: We create the base path of the truck using the Directions API
    Step 2: This path contains the general polyline which is sent to the server & is stored
    Step 3: On every delivery request, the location (coordinates) of the farmer is checked if it is near to the base path
    Step 4: If yes, we add the request to our truck journey & subtract the recalculate the capacity of our truck
    Step 5: Make these coordinates as `waypoints`
    Step 6: Recompute the best path
*/

let polyline = "";
googleMapsClient
  .directions({
    origin: "Marol, Church Rd",
    destination:
      "K. J. Somaiya Institute of Engineering and Information Technology"
  })
  .asPromise()
  .then(response => {
    // This gives the full polyline of the shortest route chosen by the Directions API
    polyline = response.json.routes[0].overview_polyline.points;

    // Decode this polyline to array of LatLng objects
    let decodedLocations = polyUtil.decode(polyline);
    let distanceArr = [];
    let result = {
      lat: 0,
      long: 0,
      distance: Infinity
    };

    // Loop over the array of LatLng objects and calculate the spherical distance between a certain point and current iterated LatLng object. Store those LatLng objects with their distances to an array
    decodedLocations.forEach(location => {
      distanceArr.push({
        location,
        distance: SphericalUtil.computeDistanceBetween(
          { latitude: 19.0587219, longitude: 72.8823227 },
          location
        )
      });
    });

    // Find the minimum distance under 1000 metres
    distanceArr.forEach(obj => {
      if (result.distance > obj.distance && obj.distance < 1000) {
        // console.log(obj.distance);
        result.lat = obj.location.latitude;
        result.long = obj.location.longitude;
        result.distance = obj.distance;
      }
    });

    // Recomputes the best route by including the above `result` point as the waypoint
    return googleMapsClient
      .directions({
        origin: "Marol, Church Rd",
        destination:
          "K. J. Somaiya Institute of Engineering and Information Technology",
        waypoints: [{ latitude: result.lat, longitude: result.long }]
      })
      .asPromise();
  })
  .then(response => {
    console.log(response.json);
  })
  .catch(err => console.log(err));
