const polyUtil = require("google-maps-polyutil");
const SphericalUtil = require("google-maps-polyutil/lib/SphericalUtil");

module.exports = (journeys, source, dest) => {
  let finalLocations = [];
  journeys.forEach(journey => {
    let polyline = journey.polyline;
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
          { latitude: source.lat, longitude: source.lng },
          location
        )
      });
    });

    // Find the minimum distance under 1000 metres
    distanceArr.forEach(obj => {
      if (result.distance > obj.distance && obj.distance < 10000) {
        // console.log(obj.distance);
        result.lat = obj.location.latitude;
        result.long = obj.location.longitude;
        result.distance = obj.distance;
      }
    });
    // console.log(result);
    if (result.lat !== 0 && result.lng !== 0 && result.distance !== null) {
      finalLocations.push({ journey, via: result });
    }
  });

  finalLocations.sort((a, b) => {
    if (a.distance < b.distance) return 1;
    else return -1;
  });
  console.log(finalLocations);
  return finalLocations[0];
};
