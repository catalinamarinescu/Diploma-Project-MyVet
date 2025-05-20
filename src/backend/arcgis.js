const axios = require('axios');

const CLIENT_ID = 'Ru2UeGHQIK3ti6is';
const CLIENT_SECRET = '3NKHt6i2urmWtqOuugvr9a4h7tNKcihxJDSiHjkOc2GgjloLlXgc-KuGSAry5DIe15pijwoAtwrg7FgDtWJJadEimGlkDXRtQ1RweRonOCjZUnm14_JL-20R5kTJFoOy';
const TOKEN_URL = 'https://www.arcgis.com/sharing/rest/oauth2/token/';
const FEATURE_LAYER_URL = 'https://services3.arcgis.com/vRyDgqz1URmrMkH2/arcgis/rest/services/locatii_bucuresti/FeatureServer/0/addFeatures';

// async function generateToken() {
//   const params = new URLSearchParams({
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//     grant_type: 'client_credentials',
//     expiration: 60,
//     f: 'json'
//   });

//   const res = await axios.post(TOKEN_URL, params);
//   return res.data.access_token;
// }

async function addClinicToArcGIS({ lat, lon, name, descriere }) {
//   const token = await generateToken();
const token = '3NKHt6i2urmWtqOuugvr9X5XAHENlbn-3EuGL86qznTs4ZRXqUbx3ds1_Y8nFPxsvhHmuwHKCKvM_co4nbJcWtA3OHAnclm92lDJrw3VN7LoSK4TGbkHi19VH78tFH5I-sfuHqOWnFEwNcz5w0';

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
      console.log('📍 Clinica adăugată în ArcGIS!');
    } else {
      console.warn('⚠️ Eșec la adăugare:', res.data);
    }
  } catch (err) {
    console.error('❌ Eroare comunicare ArcGIS:', err.message);
  }
}

module.exports = { addClinicToArcGIS };
