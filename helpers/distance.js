const polyUtil = require("google-maps-polyutil");
const SphericalUtil = require("google-maps-polyutil/lib/SphericalUtil");

module.exports = (journeys, source, dest) => {
  let finalLocations = [];
  journeys.forEach(journey => {
    let polyline = journey.polyline;
    let decodedLocations = polyUtil.decode(polyline);
    let distanceArrSource = [],
      distanceArrDest = [];
    let resultSrc = {
      lat: 0,
      long: 0,
      distance: Infinity
    };
    let resultDest = {
      lat: 0,
      long: 0,
      distance: Infinity
    };

    decodedLocations.forEach(location => {
      distanceArrDest.push({
        location,
        distance: SphericalUtil.computeDistanceBetween(
          { latitude: dest.lat, longitude: dest.lng },
          location
        )
      });
    });

    // Loop over the array of LatLng objects and calculate the spherical distance between a certain point and current iterated LatLng object. Store those LatLng objects with their distances to an array
    decodedLocations.forEach(location => {
      distanceArrSource.push({
        location,
        distance: SphericalUtil.computeDistanceBetween(
          { latitude: source.lat, longitude: source.lng },
          location
        )
      });
    });

    // Find the minimum distance under 1000 metres
    distanceArrSource.forEach(obj => {
      if (resultSrc.distance > obj.distance && obj.distance < 10000) {
        // console.log(obj.distance);
        resultSrc.lat = obj.location.latitude;
        resultSrc.long = obj.location.longitude;
        resultSrc.distance = obj.distance;
      }
    });

    distanceArrDest.forEach(obj => {
      if (resultDest.distance > obj.distance && obj.distance < 10000) {
        // console.log(obj.distance);
        resultDest.lat = obj.location.latitude;
        resultDest.long = obj.location.longitude;
        resultDest.distance = obj.distance;
      }
    });
    // console.log(result);
    if (
      resultSrc.lat !== 0 &&
      resultSrc.lng !== 0 &&
      resultSrc.distance !== null &&
      resultDest.lat !== 0 &&
      resultDest.lng !== 0 &&
      resultDest.distance !== null
    ) {
      finalLocations.push({ journey, via: resultSrc });
    }
  });

  finalLocations.sort((a, b) => {
    if (a.distance < b.distance) return 1;
    else return -1;
  });
  console.log(finalLocations);
  return finalLocations[0];
};
