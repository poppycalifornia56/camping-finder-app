// server/services/GeolocationService.js
class GeolocationService {
  async calculateDistance(origin, destination) {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth radius in km

    const dLat = this._toRad(destination.latitude - origin.latitude);
    const dLon = this._toRad(destination.longitude - origin.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._toRad(origin.latitude)) *
        Math.cos(this._toRad(destination.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  _toRad(value) {
    return (value * Math.PI) / 180;
  }
}

module.exports = GeolocationService;
