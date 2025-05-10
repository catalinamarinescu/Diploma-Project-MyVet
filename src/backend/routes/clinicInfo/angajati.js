const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('../../db'); // conexiune MSSQL
const { clinicOnly } = require('../middleware');
const { petOwnerOnly } = require('../middleware');

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

module.exports = router;