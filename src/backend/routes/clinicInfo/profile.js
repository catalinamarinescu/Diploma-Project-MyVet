const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('../../db'); // conexiune MSSQL
const { clinicOnly } = require('../middleware');
const { addClinicToArcGIS } = require('../../arcgis');

router.get('/clinic/profile', clinicOnly, async (req, res) => {
  const clinicID = req.user.id;

  try {
    const pool = await poolPromise;

    // 1. Info clinică
    const infoRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT TOP 1 NAME, DESCRIERE, LATITUDINE, LONGITUDINE, ADRESA
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
       A.EMAIL, A.TELEFON, A.POZA, -- ✅ le adăugăm aici
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
          poza: row.POZA,
          servicii: [],
          serviciiIds: []
        };
      }
      if (row.DENUMIRE_SERVICIU) {
        angajatiMap[row.ID].servicii.push(row.DENUMIRE_SERVICIU);
        angajatiMap[row.ID].serviciiIds.push(row.SERVICIU_ID);
      }
    });

    const angajati = Object.values(angajatiMap);

    res.json({
      name: info.NAME,
      descriere: info.DESCRIERE,
      latitudine: info.LATITUDINE,
      longitudine: info.LONGITUDINE,
      adresa: info.ADRESA,
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
  const { name, descriere, latitudine, longitudine, adresa } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('ID_CLINICA', clinicID)
      .input('NAME', name)
      .input('DESCRIERE', descriere)
      .input('LATITUDINE', latitudine)
      .input('LONGITUDINE', longitudine)
      .input('ADRESA', adresa)
      .query(`
        UPDATE CLINIC_INFO
        SET NAME = @NAME,
            DESCRIERE = @DESCRIERE,
            LATITUDINE = @LATITUDINE,
            LONGITUDINE = @LONGITUDINE,
            ADRESA = @ADRESA
        WHERE ID_CLINICA = @ID_CLINICA
      `);

      await addClinicToArcGIS({
        lat: latitudine,
        lon: longitudine,
        name,
        descriere: descriere,
        adresa: adresa
      });  

    res.status(200).json({ message: 'Profil actualizat cu succes!' });
  } catch (err) {
    console.error('Eroare la actualizare profil:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

module.exports = router;