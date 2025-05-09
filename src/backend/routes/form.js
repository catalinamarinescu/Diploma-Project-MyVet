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
  const { name, description, latitude, longitude } = req.body;
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
      .input('NAME', name)
      .query(`
        INSERT INTO CLINIC_INFO (ID_CLINICA, DESCRIERE, LATITUDINE, LONGITUDINE, NAME)
        VALUES (@ID_CLINICA, @DESCRIERE, @LATITUDINE, @LONGITUDINE, @NAME)
      `);

    await addClinicToArcGIS({
      lat: latitude,
      lon: longitude,
      name,
      descriere: description
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

router.get('/clinic/profile', clinicOnly, async (req, res) => {
  const clinicID = req.user.id;

  try {
    const pool = await poolPromise;

    // 1. Info clinică
    const infoRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT TOP 1 NAME, DESCRIERE, LATITUDINE, LONGITUDINE
        FROM CLINIC_INFO
        WHERE ID_CLINICA = @ID_CLINICA
      `);
    const info = infoRes.recordset[0];

    // 2. Imagini
    const imgRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`SELECT CALE_IMAGINE FROM IMAGINI_CLINICA WHERE ID_CLINICA = @ID_CLINICA`);
    const imagini = imgRes.recordset.map(i => i.CALE_IMAGINE);

    // 3. Servicii
    const servRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT ID, TIP_SERVICIU, DENUMIRE_SERVICIU, PRET, DESCRIERE
        FROM SERVICII
        WHERE ID_CLINICA = @ID_CLINICA
      `);
    const servicii = servRes.recordset.map(s => ({
      id: s.ID,
      tip: s.TIP_SERVICIU,
      denumire: s.DENUMIRE_SERVICIU,
      pret: s.PRET,
      descriere: s.DESCRIERE
    }));

    // 4. Angajați + servicii oferite
    const angRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT A.ID, A.NUME, A.PRENUME, A.TIP_ANGAJAT,
       A.EMAIL, A.TELEFON, -- ✅ le adăugăm aici
       S.DENUMIRE_SERVICIU
      FROM ANGAJATI A
      LEFT JOIN ANGAJATI_SERVICII ASG ON A.ID = ASG.ANGAJAT_ID
      LEFT JOIN SERVICII S ON ASG.SERVICIU_ID = S.ID
      WHERE A.ID_CLINICA = @ID_CLINICA

      `);

    // grupare angajați
    const angajatiMap = {};
    angRes.recordset.forEach(row => {
      if (!angajatiMap[row.ID]) {
        angajatiMap[row.ID] = {
          id: row.ID,
          nume: row.NUME,
          prenume: row.PRENUME,
          tip: row.TIP_ANGAJAT,
          email: row.EMAIL,
          telefon: row.TELEFON,
          servicii: []
        };
      }
      if (row.DENUMIRE_SERVICIU) {
        angajatiMap[row.ID].servicii.push(row.DENUMIRE_SERVICIU);
      }
    });

    const angajati = Object.values(angajatiMap);

    res.json({
      name: info.NAME,
      descriere: info.DESCRIERE,
      latitudine: info.LATITUDINE,
      longitudine: info.LONGITUDINE,
      imagini,
      servicii,
      angajati
    });

  } catch (err) {
    console.error('Eroare la GET /profile:', err);
    res.status(500).json({ error: 'Eroare server la încărcarea profilului' });
  }
});

router.get('/profil-completat', clinicOnly, async (req, res) => {
  const clinicID = req.user.id;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`SELECT COUNT(*) AS count FROM CLINIC_INFO WHERE ID_CLINICA = @ID_CLINICA`);

    const completat = result.recordset[0].count > 0;
    res.json({ completat });
  } catch (err) {
    console.error('Eroare verificare profil complet:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.put('/clinic/profile', clinicOnly, async (req, res) => {
  const clinicID = req.user.id;
  const { name, descriere, latitudine, longitudine } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('ID_CLINICA', clinicID)
      .input('NAME', name)
      .input('DESCRIERE', descriere)
      .input('LATITUDINE', latitudine)
      .input('LONGITUDINE', longitudine)
      .query(`
        UPDATE CLINIC_INFO
        SET NAME = @NAME,
            DESCRIERE = @DESCRIERE,
            LATITUDINE = @LATITUDINE,
            LONGITUDINE = @LONGITUDINE
        WHERE ID_CLINICA = @ID_CLINICA
      `);

    res.status(200).json({ message: 'Profil actualizat cu succes!' });
  } catch (err) {
    console.error('Eroare la actualizare profil:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.put('/clinic/servicii', clinicOnly, async (req, res) => {
  const clinicID = req.user.id;
  const servicii = req.body.servicii;

  if (!Array.isArray(servicii)) {
    return res.status(400).json({ error: 'Format invalid: așteptam un array de servicii.' });
  }

  try {
    const pool = await poolPromise;

    for (const s of servicii) {
      const request = pool.request()
        .input('TIP_SERVICIU', s.tip)
        .input('DENUMIRE_SERVICIU', s.denumire)
        .input('PRET', s.pret)
        .input('DESCRIERE', s.descriere)
        .input('ID_CLINICA', clinicID);
    
      if (s.id) {
        request.input('ID', s.id);
        await request.query(`
          UPDATE SERVICII
          SET TIP_SERVICIU = @TIP_SERVICIU,
              DENUMIRE_SERVICIU = @DENUMIRE_SERVICIU,
              PRET = @PRET,
              DESCRIERE = @DESCRIERE
          WHERE ID = @ID AND ID_CLINICA = @ID_CLINICA
        `);
      } else {
        await request.query(`
          INSERT INTO SERVICII (ID_CLINICA, TIP_SERVICIU, DENUMIRE_SERVICIU, PRET, DESCRIERE)
          VALUES (@ID_CLINICA, @TIP_SERVICIU, @DENUMIRE_SERVICIU, @PRET, @DESCRIERE)
        `);
      }
    }

    res.status(200).json({ message: 'Servicii actualizate cu succes!' });
  } catch (err) {
    console.error('Eroare la actualizare servicii:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.delete('/clinic/servicii/:id', clinicOnly, async(req, res) => {
  const clinicID = req.user.id;
  const serviciuID = parseInt(req.params.id);

  try {
    const pool = await poolPromise;
    
    await pool.request()
      .input('SERVICIU_ID', serviciuID)
      .query(`DELETE FROM ANGAJATI_SERVICII WHERE SERVICIU_ID = @SERVICIU_ID`);
      
    const result = await pool.request()
      .input('ID', serviciuID)
      .input('ID_CLINICA', clinicID)
      .query(`DELETE FROM SERVICII WHERE ID = @ID AND ID_CLINICA = @ID_CLINICA`);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Serviciul nu a fost găsit sau nu aparține clinicii." });
    }

    res.status(200).json({ message: 'Serviciu șters cu succes!' });
  } catch (err) {
    console.error("Eroare la ștergere serviciu:", err);
    res.status(500).json({ error: "Eroare server la ștergere." });
  }
});

router.put('/clinic/angajati', clinicOnly, async (req, res) => {
  const clinicID = req.user.id;
  const angajati = req.body.angajati;

  if (!Array.isArray(angajati)) {
    return res.status(400).json({ error: 'Format invalid: așteptam un array de angajati.' });
  }

  try {
    const pool = await poolPromise;

    for (const a of angajati) {
      const request = pool.request()
        .input('NUME', a.nume)
        .input('PRENUME', a.prenume)
        .input('EMAIL', a.email)
        .input('TELEFON', a.telefon)
        .input('TIP_ANGAJAT', a.tip)
        .input('ID_CLINICA', clinicID);
    
      if (a.id) {
        request.input('ID', a.id);
        await request.query(`
          UPDATE ANGAJATI
          SET NUME = @NUME,
              PRENUME = @PRENUME,
              EMAIL = @EMAIL,
              TELEFON = @TELEFON,
              TIP_ANGAJAT = @TIP_ANGAJAT
          WHERE ID = @ID AND ID_CLINICA = @ID_CLINICA
        `);
      } else {
        await request.query(`
          INSERT INTO ANGAJATI (ID_CLINICA, NUME, PRENUME, EMAIL, TELEFON, TIP_ANGAJAT)
          VALUES (@ID_CLINICA, @NUME, @PRENUME, @EMAIL, @TELEFON, @TIP_ANGAJAT)
        `);
      }
    }

    res.status(200).json({ message: 'Angajati actualizati cu succes!' });
  } catch (err) {
    console.error('Eroare la actualizare angajati:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.delete('/clinic/angajati/:id', clinicOnly, async(req, res) =>{
  const clinicID = req.user.id;
  const angajatID = parseInt(req.params.id);

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('ANGAJAT_ID', angajatID)
      .query(`DELETE FROM ANGAJATI_SERVICII WHERE ANGAJAT_ID = @ANGAJAT_ID`);

    const result = await pool.request()
      .input('ID', angajatID)
      .input('ID_CLINICA', clinicID)
      .query(`DELETE FROM ANGAJATI WHERE ID = @ID AND ID_CLINICA = @ID_CLINICA`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Angajatul nu a fost găsit sau nu aparține clinicii." });
    }

    res.status(200).json({message: 'Angajat sters cu succes!'});
  } catch (err) {
    console.error("Eroare la stergere angajat:", err);
    res.status(500).json({error: " Eroare server la stergere"});
  }
});

router.get('/clinics/all', petOwnerOnly, async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        CI.ID_CLINICA AS id,
        CI.NAME AS name,
        CI.DESCRIERE AS descriere,
        CI.LATITUDINE AS latitudine,
        CI.LONGITUDINE AS longitudine,
        (
          SELECT TOP 1 CALE_IMAGINE 
          FROM IMAGINI_CLINICA 
          WHERE ID_CLINICA = CI.ID_CLINICA
        ) AS imagine
      FROM CLINIC_INFO CI
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET /clinics/all:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

module.exports = router;
