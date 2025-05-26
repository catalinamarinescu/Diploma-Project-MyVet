const express = require('express');
const cors = require('cors');
const app = express();

const { poolPromise } = require('./db');

const authRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const formRoute = require('./routes/form');
const clinicProfileRoute = require('./routes/clinicInfo/profile');
const clinicServicesRoute = require('./routes/clinicInfo/servicii');
const clinicEmployeesRoute = require('./routes/clinicInfo/angajati');
const clinicsRoute = require('./routes/clinicInfo/clinics');
const petsRoute = require('./routes/client/pets');
const imagesRoute = require('./images');
const clientProfileRoutes = require('./routes/client/profile');
const favRoute = require('./routes/client/favs');
const summaryRoute = require('./routes/client/summary');
const joinRoute = require('./routes/client/joinClinic');
const notifRoute = require('./routes/clinicInfo/notif');
const patientsRoute = require('./routes/clinicInfo/patients');
const medrecRoute = require('./routes/clinicInfo/medicalRecord');
const myClinicRoute = require('./routes/client/myClinic');
// Middleware
app.use(cors()); // permite cereri de pe alte porturi (ex: React)
app.use(express.json()); // permite parsarea JSON-ului din request body

app.use('/api', authRoutes);
app.use('/api', loginRoutes);
app.use('/api', formRoute);
app.use('/api', clinicProfileRoute);
app.use('/api', clinicServicesRoute);
app.use('/api', clinicEmployeesRoute);
app.use('/api', clinicsRoute);
app.use('/uploads', express.static('uploads'));
app.use('/api/client', petsRoute); 
app.use('/api', imagesRoute);
app.use('/api/client', clientProfileRoutes);
app.use('/api/client', favRoute);  
app.use('/api/client', summaryRoute);  
app.use('/api/client', joinRoute);
app.use('/api/clinic', notifRoute);
app.use('/api/clinic', patientsRoute);
app.use('/api/client', patientsRoute);
app.use('/api/clinic', medrecRoute);
app.use('/api/client', myClinicRoute);    


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server pornit pe http://localhost:${PORT}`);
});
