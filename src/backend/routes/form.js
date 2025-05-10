const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('../db'); // conexiune MSSQL
const { clinicOnly } = require('./middleware');
const { petOwnerOnly } = require('./middleware');
const { addClinicToArcGIS } = require('../arcgis');

// setup multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/form', clinicOnly, upload.array('images'), async (req, res) => {
  const clinicID = req.user.id; // ← ID_CLINICA din token
  const { name, description, latitude, longitude, address } = req.body;
  const services = JSON.parse(req.body.services);
  const employees = JSON.parse(req.body.employees);
  const images = req.files;

  try {
    const pool = await poolPromise;

    // 1. Info clinică
    await pool.request()
      .input('ID_CLINICA', clinicID)
      .input('DESCRIERE', description)
      .input('LATITUDINE', latitude)
      .input('LONGITUDINE', longitude)
      .input('ADRESA', address)
      .input('NAME', name)
      .query(`
        INSERT INTO CLINIC_INFO (ID_CLINICA, DESCRIERE, LATITUDINE, LONGITUDINE, NAME, ADRESA)
        VALUES (@ID_CLINICA, @DESCRIERE, @LATITUDINE, @LONGITUDINE, @NAME, @ADRESA)
      `);

    await addClinicToArcGIS({
      lat: latitude,
      lon: longitude,
      name,
      descriere: description,
      adresa: address
    });  

    // 2. Imagini
    for (const file of images) {
      const publicPath = file.path.replace(/\\/g, '/');
      await pool.request()
        .input('ID_CLINICA', clinicID)
        .input('CALE_IMAGINE', publicPath)
        .query(`
          INSERT INTO IMAGINI_CLINICA (ID_CLINICA, CALE_IMAGINE)
          VALUES (@ID_CLINICA, @CALE_IMAGINE)
        `);
    }

    // 3. Servicii
    const serviciuIdMap = {}; // mapăm nume -> ID
    for (const s of services) {
      const result = await pool.request()
        .input('ID_CLINICA', clinicID)
        .input('TIP_SERVICIU', s.type)
        .input('DENUMIRE_SERVICIU', s.name)
        .input('PRET', s.price)
        .input('DESCRIERE', s.description)
        .query(`
          INSERT INTO SERVICII (ID_CLINICA, TIP_SERVICIU, DENUMIRE_SERVICIU, PRET, DESCRIERE)
          OUTPUT INSERTED.ID AS ID
          VALUES (@ID_CLINICA, @TIP_SERVICIU, @DENUMIRE_SERVICIU, @PRET, @DESCRIERE)
        `);
      serviciuIdMap[s.name] = result.recordset[0].ID;
    }

    // 4. Angajați + legături
    for (const a of employees) {
      const result = await pool.request()
        .input('ID_CLINICA', clinicID)
        .input('NUME', a.name)
        .input('PRENUME', a.lastName)
        .input('EMAIL', a.email)
        .input('TELEFON', a.phoneNumber)
        .input('TIP_ANGAJAT', a.type)
        .query(`
          INSERT INTO ANGAJATI (ID_CLINICA, NUME, PRENUME, EMAIL, TELEFON, TIP_ANGAJAT)
          OUTPUT INSERTED.ID AS ID
          VALUES (@ID_CLINICA, @NUME, @PRENUME, @EMAIL, @TELEFON, @TIP_ANGAJAT)
        `);

      const angajatID = result.recordset[0].ID;

      for (const serviceName of a.providedServices) {
        const serviciuID = serviciuIdMap[serviceName];
        if (serviciuID) {
          await pool.request()
            .input('ANGAJAT_ID', angajatID)
            .input('SERVICIU_ID', serviciuID)
            .query(`
              INSERT INTO ANGAJATI_SERVICII (ANGAJAT_ID, SERVICIU_ID)
              VALUES (@ANGAJAT_ID, @SERVICIU_ID)
            `);
        }
      }
    }

    res.status(200).json({ message: '✅ Profil clinică salvat cu succes!' });
  } catch (err) {
    console.error('❌ Eroare la salvare:', err);
    res.status(500).json({ error: 'Eroare server la completare profil' });
  }
});

module.exports = router;
