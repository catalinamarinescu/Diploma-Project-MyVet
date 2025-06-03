const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('../../db'); // conexiune MSSQL
const { clinicOnly } = require('../middleware');
const { petOwnerOnly } = require('../middleware');
const { request } = require('http');

const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.put('/clinic/angajati/:id', clinicOnly, upload.single('poza'), async (req, res) => {
  const clinicID = req.user.id;
  const angajatID = parseInt(req.params.id);
  const { nume, prenume, email, telefon, tip } = req.body;
  const poza = req.file ? req.file.path.replace(/\\/g, '/') : null;

  try {
    const pool = await poolPromise;

    const query = poza
      ? `
        UPDATE ANGAJATI
        SET NUME = @NUME,
            PRENUME = @PRENUME,
            EMAIL = @EMAIL,
            TELEFON = @TELEFON,
            TIP_ANGAJAT = @TIP_ANGAJAT,
            POZA = @POZA
        WHERE ID = @ID AND ID_CLINICA = @ID_CLINICA
      `
      : `
        UPDATE ANGAJATI
        SET NUME = @NUME,
            PRENUME = @PRENUME,
            EMAIL = @EMAIL,
            TELEFON = @TELEFON,
            TIP_ANGAJAT = @TIP_ANGAJAT
        WHERE ID = @ID AND ID_CLINICA = @ID_CLINICA
      `;

    const request = pool.request()
      .input('ID', angajatID)
      .input('ID_CLINICA', clinicID)
      .input('NUME', nume)
      .input('PRENUME', prenume)
      .input('EMAIL', email)
      .input('TELEFON', telefon)
      .input('TIP_ANGAJAT', tip);

    if (poza) request.input('POZA', poza);

    await request.query(query);
    const servicii = req.body.servicii ? JSON.parse(req.body.servicii) : [];

    await pool.request()
      .input('ANGAJAT_ID', angajatID)
      .query(`DELETE FROM ANGAJATI_SERVICII WHERE ANGAJAT_ID = @ANGAJAT_ID`);

    for (const serviceID of servicii) {
      await pool.request()
        .input('ANGAJAT_ID', angajatID)
        .input('SERVICIU_ID', serviceID)
        .query(`
          INSERT INTO ANGAJATI_SERVICII (ANGAJAT_ID, SERVICIU_ID)
          VALUES (@ANGAJAT_ID, @SERVICIU_ID)
        `);
    }
    res.status(200).json({ message: 'Angajat actualizat cu succes!' });
  } catch (err) {
    console.error('Eroare la actualizare angajat:', err);
    res.status(500).json({ error: 'Eroare server la update' });
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

router.post('/clinic/angajati', clinicOnly, upload.single('poza'), async (req, res) => {
  const { nume, prenume, email, telefon, tip } = req.body;
  const poza = req.file ? req.file.path.replace(/\\/g, '/') : null;
  const servicii = req.body.servicii ? JSON.parse(req.body.servicii) : [];

  try {
    const pool = await poolPromise;

    const insertResult = await pool.request()
      .input('ID_CLINICA', req.user.id)
      .input('NUME', nume)
      .input('PRENUME', prenume)
      .input('EMAIL', email)
      .input('TELEFON', telefon)
      .input('TIP_ANGAJAT', tip)
      .input('POZA', poza)
      .query(`
        INSERT INTO ANGAJATI (ID_CLINICA, NUME, PRENUME, EMAIL, TELEFON, TIP_ANGAJAT, POZA)
        OUTPUT INSERTED.ID
        VALUES (@ID_CLINICA, @NUME, @PRENUME, @EMAIL, @TELEFON, @TIP_ANGAJAT, @POZA)
      `);

    const angajatID = insertResult.recordset[0].ID;

    for (const id of servicii) {
      await pool.request()
        .input('ANGAJAT_ID', angajatID)
        .input('SERVICIU_ID', id)
        .query(`INSERT INTO ANGAJATI_SERVICII (ANGAJAT_ID, SERVICIU_ID) VALUES (@ANGAJAT_ID, @SERVICIU_ID)`);
    }

    res.status(201).json({ message: 'Angajat adăugat cu succes!' });
  } catch (err) {
    console.error('Eroare la inserare angajat:', err);
    res.status(500).json({ error: 'Eroare server la inserare' });
  }
});

// GET employees for current clinic
router.get('/clinic/angajati', clinicOnly, async (req, res) => {
  const clinicId = req.user.id;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_CLINICA', clinicId)
      .query(`
        SELECT 
          E.ID,
          E.PRENUME + ' ' + E.NUME AS FULL_NAME,
          E.TIP_ANGAJAT,
          E.POZA
        FROM ANGAJATI E
        WHERE E.ID_CLINICA = @ID_CLINICA
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la preluare angajați:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});



module.exports = router;