const axios = require('axios');

const FEATURE_LAYER_URL = 'https://services3.arcgis.com/vRyDgqz1URmrMkH2/arcgis/rest/services/locatii_bucuresti/FeatureServer/0/addFeatures';


async function addClinicToArcGIS({ lat, lon, name, descriere }) {
const token = '3NKHt6i2urmWtqOuugvr9b2OmdyNv7rlVkwqhG1FQ4Jjfi1rMbDgF_CWXrAKJmkoZCvh0NsUINu-OG2R3BUKgUYqt-jSmKM1mUzvyjB5zmW3t-IKHwa5mPKuB2hLjz26';

  const feature = {
    geometry: {
      x: parseFloat(lon),
      y: parseFloat(lat),
      spatialReference: { wkid: 4326 }
    },
    attributes: {
      Name: name,
      Latitude: parseFloat(lat),
      Longitude: parseFloat(lon),
      categorie: 'clinica'
    }
  };

  const payload = new URLSearchParams({
    f: 'json',
    token,
    features: JSON.stringify([feature])
  });

  try {
    const res = await axios.post(FEATURE_LAYER_URL, payload);
    if (res.data?.addResults?.[0]?.success) {
      console.log('Clinica adăugată în ArcGIS!');
    } else {
      console.warn('Eșec la adăugare:', res.data);
    }
  } catch (err) {
    console.error(' Eroare comunicare ArcGIS:', err.message);
  }
}

module.exports = { addClinicToArcGIS };
