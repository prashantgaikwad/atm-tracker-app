import { ToastAndroid } from 'react-native';
import timeoutPromise from './promise-utils';

export default {

  getAtms(region, withCash, callback) {
    const url = 'http://35.154.34.199:3000/api/atms';
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const min = { lat: latitude - (latitudeDelta/2), lng: longitude - (longitudeDelta/2) };
    const max = { lat: latitude + (latitudeDelta/2), lng: longitude + (longitudeDelta/2) };
    const body = { bounds: { min, max }, isMobile: true, cashOnly: withCash };
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    timeoutPromise(5000, fetchPromise).then((response) => response.json())
    .then((response = []) => {
      callback(response.data);
    })
    .catch((error) => {
      ToastAndroid.show(`Failed to load atms. ${error.message}`, ToastAndroid.LONG);
      callback([]);
    });
  },
  
  updateAtm(id, status, callback) {
    const url = `http://35.154.34.199:3000/api/atm/update?id=${id}&status=${status}`;
    const fetchPromise = fetch(url, {
      method: 'GET',
    });
    timeoutPromise(5000, fetchPromise).then((response) => response.json())
    .then(() => {
      callback();
    })
    .catch((error) => {
      ToastAndroid.show(`Failed to update atm. ${error.message}`, ToastAndroid.LONG);
      callback();
    });
  },
};
