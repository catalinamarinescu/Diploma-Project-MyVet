const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { clinicOnly } = require('../middleware');
const sql = require('mssql');


// ⬇️ RUTA PENTRU JOIN REQUESTS
router.get('/join-requests', clinicOnly, async (req, res) => {
  const clinicId = req.user.id;
  
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_CLINIC', clinicId)
      .query(`
        SELECT 
          R.ID AS ID_REQUEST,
          R.MESSAGE,
          R.STATUS,
          R.CREATED_AT,
          CP.FIRST_NAME,
          CP.LAST_NAME,
          CP.PHONE,
          CP.IMAGE
        FROM CLINIC_JOIN_REQUESTS R
        JOIN PET_OWNERS PO ON R.ID_PET_OWNER = PO.ID_PET_OWNER
        LEFT JOIN CLIENT_PROFILE CP ON CP.ID_PET_OWNER = PO.ID_PET_OWNER
        WHERE R.ID_CLINIC = @ID_CLINIC AND R.STATUS = 'pending'
        ORDER BY R.CREATED_AT DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la preluare cereri:', err);
    res.status(500).json({ error: 'Eroare la preluare cereri' });
  }
});


// Accept request
// Accept/reject join request
router.post('/join-requests/:id/:action', clinicOnly, async (req, res) => {
  const requestId = req.params.id;
  const action = req.params.action.toLowerCase(); // "accept" sau "reject"
  const clinicId = req.user.id;

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  const newStatus = action === 'accept' ? 'approved' : 'rejected';

  try {
    const pool = await poolPromise;

    // Obține ID_PET_OWNER asociat cu cererea
    const result = await pool.request()
      .input('REQUEST_ID', requestId)
      .input('CLINIC_ID', clinicId)
      .query(`
        SELECT ID_PET_OWNER
        FROM CLINIC_JOIN_REQUESTS
        WHERE ID = @REQUEST_ID AND ID_CLINIC = @CLINIC_ID
      `);

    const request = result.recordset[0];
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const ownerId = request.ID_PET_OWNER;

    // Actualizează statusul cererii
    await pool.request()
      .input('NEW_STATUS', newStatus)
      .input('REQUEST_ID', requestId)
      .query(`
        UPDATE CLINIC_JOIN_REQUESTS
        SET STATUS = @NEW_STATUS
        WHERE ID = @REQUEST_ID
      `);

      // Dacă este acceptat, inserează în CLINIC_PATIENTS dacă nu există deja
      if (action === 'accept') {
        await pool.request()
      .input('ID_PET_OWNER', ownerId)
      .input('ID_CLINICA', clinicId)
      .query(`
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM PATIENTS_OWNER WHERE ID_PET_OWNER = @ID_PET_OWNER AND ID_CLINICA = @ID_CLINICA
          )
          BEGIN
            INSERT INTO PATIENTS_OWNER (ID_PET_OWNER, ID_CLINICA)
            VALUES (@ID_PET_OWNER, @ID_CLINICA)
          END
        END
      `);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error processing join request:', err);
    res.status(500).json({ error: 'Failed to process join request' });
  }
});



// Reject request
router.post('/join-requests/:id/reject', clinicOnly, async (req, res) => {
  const requestId = req.params.id;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID_REQUEST', requestId)
      .query('DELETE FROM CLINIC_JOIN_REQUESTS WHERE ID = @ID_REQUEST');
    res.json({ success: true });
  } catch (err) {
    console.error('Error rejecting request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/appointment-notifications', clinicOnly, async (req, res) => {
  const clinicId = req.user.id; // asumat că user.id este ID-ul clinicii autentificate

  try {
     const pool = await poolPromise;
    const after = req.query.after;
    let condition = 'P.CREATED_AT >= DATEADD(MINUTE, -1440, GETDATE())';

    if (after) {
      condition = 'P.CREATED_AT > @AFTER';
    }

    const request = pool.request()
      .input('ID_CLINICA', clinicId);

    if (after) {
      request.input('AFTER', sql.DateTime, new Date(after));
    }

    const result = await request.query(`
      SELECT TOP 5 
        P.ID,
        P.DATA_ORA_INCEPUT,
        PETS.NUME AS PET_NAME,
        A.PRENUME + ' ' + A.NUME AS DOCTOR_NAME
      FROM PROGRAMARI P
      INNER JOIN PETS ON P.ID_PET = PETS.ID
      INNER JOIN ANGAJATI A ON P.ID_MEDIC = A.ID
      WHERE P.ID_CLINICA = @ID_CLINICA
        AND ${condition}
      ORDER BY P.CREATED_AT DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare notificări programări:', err);
    res.status(500).json({ error: 'Eroare server notificări' });
  }
});


module.exports = router;