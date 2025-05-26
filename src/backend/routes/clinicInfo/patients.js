const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { clinicOnly } = require('../middleware');

router.get('/patients/owners', clinicOnly, async (req, res) => {
  const clinicId = req.user.id;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('ID_CLINIC', clinicId)
      .query(`
        SELECT 
          CPAT.ID_PET_OWNER,
          P.FIRST_NAME,
          P.LAST_NAME,
          P.IMAGE
        FROM PATIENTS_OWNER CPAT
        JOIN CLIENT_PROFILE P ON P.ID_PET_OWNER = CPAT.ID_PET_OWNER
        WHERE CPAT.ID_CLINICA = @ID_CLINIC
      `);
      res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la preluare pacienți:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.get('/:ownerId/registered-pets', clinicOnly, async (req, res) => {
  const ownerId = parseInt(req.params.ownerId);
  const clinicId = parseInt(req.query.clinicId);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('OWNER_ID', ownerId)
      .input('CLINIC_ID', clinicId)
      .query(`
        SELECT P.ID, P.NUME, P.RASA, P.TIP, P.VARSTA,  P.POZA, MR.STATUS
        FROM MEDICAL_RECORD MR
        JOIN PETS P ON P.ID = MR.ID_PET
        WHERE P.ID_PET_OWNER = @OWNER_ID AND MR.ID_CLINICA = @CLINIC_ID
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET registered-pets:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});



module.exports = router;