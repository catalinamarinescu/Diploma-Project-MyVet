const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('../../db'); // conexiune MSSQL
const { clinicOnly } = require('../middleware');

router.put('/clinic/servicii', clinicOnly, async (req, res) => {
  const clinicID = req.user.id;
  const servicii = req.body.servicii;

  if (!Array.isArray(servicii)) {
    return res.status(400).json({ error: 'Format invalid: așteptam un array de servicii.' });
  }

  try {
    const pool = await poolPromise;

    for (const s of servicii) {
      const checkExist = await pool.request()
        .input('DENUMIRE_SERVICIU', s.denumire)
        .input('ID_CLINICA', clinicID)
        .query(`
          SELECT ID FROM SERVICII
          WHERE DENUMIRE_SERVICIU = @DENUMIRE_SERVICIU AND ID_CLINICA = @ID_CLINICA
        `);

      if (checkExist.recordset.length > 0) {
        const existingID = checkExist.recordset[0].ID;
        await pool.request()
          .input('ID', existingID)
          .input('TIP_SERVICIU', s.tip)
          .input('DENUMIRE_SERVICIU', s.denumire)
          .input('PRET', s.pret)
          .input('DESCRIERE', s.descriere)
          .query(`
            UPDATE SERVICII
              SET TIP_SERVICIU = @TIP_SERVICIU,
              DENUMIRE_SERVICIU = @DENUMIRE_SERVICIU,
              PRET = @PRET,
              DESCRIERE = @DESCRIERE
              WHERE ID = @ID
          `);
      } else {
        await pool.request()
          .input('TIP_SERVICIU', s.tip)
          .input('DENUMIRE_SERVICIU', s.denumire)
          .input('PRET', s.pret)
          .input('DESCRIERE', s.descriere)
          .input('ID_CLINICA', clinicID)
          .query(`
              INSERT INTO SERVICII (ID_CLINICA, TIP_SERVICIU, DENUMIRE_SERVICIU, PRET, DESCRIERE)
              VALUES (@ID_CLINICA, @TIP_SERVICIU, @DENUMIRE_SERVICIU, @PRET, @DESCRIERE)
          `)
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

module.exports = router;