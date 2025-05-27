const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('../../db'); // conexiune MSSQL
const { clinicOnly } = require('../middleware');

router.put('/clinic/servicii/:id', clinicOnly, async (req, res) => {
  const clinicID = req.user.id;
  const serviciuID = parseInt(req.params.id);
  const { tip, denumire, pret, descriere, durata } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID', serviciuID)
      .input('TIP_SERVICIU', tip)
      .input('DENUMIRE_SERVICIU', denumire)
      .input('PRET', pret)
      .input('DESCRIERE', descriere)
      .input('DURATA', durata)
      .input('ID_CLINICA', clinicID)
      .query(`
        UPDATE SERVICII
        SET TIP_SERVICIU = @TIP_SERVICIU,
            DENUMIRE_SERVICIU = @DENUMIRE_SERVICIU,
            PRET = @PRET,
            DESCRIERE = @DESCRIERE,
            DURATA = @DURATA
        WHERE ID = @ID AND ID_CLINICA = @ID_CLINICA
      `);

    res.status(200).json({ message: 'Serviciu actualizat cu succes!' });
  } catch (err) {
    console.error('Eroare la update serviciu:', err);
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

// POST: Adăugare serviciu individual (pentru frontend)
router.post('/clinic/servicii', clinicOnly, async (req, res) => {
  const clinicID = req.user.id;
  const { tip, denumire, pret, descriere, durata } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('ID_CLINICA', clinicID)
      .input('TIP_SERVICIU', tip)
      .input('DENUMIRE_SERVICIU', denumire)
      .input('PRET', pret)
      .input('DESCRIERE', descriere)
      .input('DURATA', durata)
      .query(`
        INSERT INTO SERVICII (ID_CLINICA, TIP_SERVICIU, DENUMIRE_SERVICIU, PRET, DESCRIERE, DURATA)
        VALUES (@ID_CLINICA, @TIP_SERVICIU, @DENUMIRE_SERVICIU, @PRET, @DESCRIERE, @DURATA)
      `);

    res.status(201).json({ message: 'Serviciu adăugat cu succes.' });
  } catch (err) {
    console.error('Eroare la POST /clinic/servicii:', err);
    res.status(500).json({ error: 'Eroare server.' });
  }
});


module.exports = router;