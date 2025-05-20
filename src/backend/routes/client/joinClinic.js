const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { petOwnerOnly } = require('../middleware');

// POST /api/client/join-clinic
router.post('/join-clinic', petOwnerOnly, async (req, res) => {
  const { clinicId, message } = req.body;
  const clientId = req.user.id;

  try {
    const pool = await poolPromise;

    // Verifică dacă există deja o cerere pending
    const existing = await pool.request()
      .input('ID_PET_OWNER', clientId)
      .input('ID_CLINIC', clinicId)
      .query(`
        SELECT 1 FROM CLINIC_JOIN_REQUESTS
        WHERE ID_PET_OWNER = @ID_PET_OWNER AND ID_CLINIC = @ID_CLINIC AND STATUS = 'pending'
      `);

    if (existing.recordset.length > 0) {
      return res.status(400).json({ error: 'Cerere deja trimisă.' });
    }

    await pool.request()
      .input('ID_PET_OWNER', clientId)
      .input('ID_CLINIC', clinicId)
      .input('MESSAGE', message || '')
      .query(`
        INSERT INTO CLINIC_JOIN_REQUESTS (ID_PET_OWNER, ID_CLINIC, MESSAGE)
        VALUES (@ID_PET_OWNER, @ID_CLINIC, @MESSAGE)
      `);

    res.status(200).json({ message: 'Cerere trimisă cu succes' });
  } catch (err) {
    console.error('Eroare la POST /join-clinic:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

module.exports = router;
