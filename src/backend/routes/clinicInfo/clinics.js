const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('../../db'); // conexiune MSSQL
const { petOwnerOnly } = require('../middleware');

router.get('/clinics/all', petOwnerOnly, async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        CI.ID_CLINICA AS id,
        CI.NAME AS name,
        CI.DESCRIERE AS descriere,
        CI.ADRESA AS adresa,
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

router.get('/clinics/:id', async (req, res) => {
  const clinicID = req.params.id;

  try {
    const pool = await poolPromise;

    // 1. Info clinică
    const infoRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT TOP 1 ID_CLINICA, NAME, DESCRIERE, LATITUDINE, LONGITUDINE, ADRESA
        FROM CLINIC_INFO
        WHERE ID_CLINICA = @ID_CLINICA
      `);

    const info = infoRes.recordset[0];
    if (!info) return res.status(404).json({ error: 'Clinică inexistentă' });

    // 2. Imagine (prima din listă)
    const imgRes = await pool.request()
    .input('ID_CLINICA', clinicID)
    .query(`
      SELECT CALE_IMAGINE 
      FROM IMAGINI_CLINICA 
      WHERE ID_CLINICA = @ID_CLINICA
    `);

    const imagini = imgRes.recordset.map(img => img.CALE_IMAGINE.replace(/\\/g, '/'));

    // 3. Servicii
    const servRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT TIP_SERVICIU, DENUMIRE_SERVICIU, PRET, DESCRIERE
        FROM SERVICII
        WHERE ID_CLINICA = @ID_CLINICA
      `);
    const servicii = servRes.recordset.map(s => ({
      tip: s.TIP_SERVICIU,
      denumire: s.DENUMIRE_SERVICIU,
      pret: s.PRET,
      descriere: s.DESCRIERE
    }));

    // 4. Angajați
    const angRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT NUME, PRENUME, TIP_ANGAJAT, EMAIL, TELEFON, POZA
        FROM ANGAJATI
        WHERE ID_CLINICA = @ID_CLINICA
      `);
    const angajati = angRes.recordset.map(a => ({
      nume: a.NUME,
      prenume: a.PRENUME,
      tip: a.TIP_ANGAJAT,
      email: a.EMAIL,
      telefon: a.TELEFON,
      poza: a.POZA
    }));

    

    // ✔️ Răspuns complet
    res.json({
      id: info.ID_CLINICA,
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
    console.error('Eroare la GET /clinics/:id:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

module.exports = router;