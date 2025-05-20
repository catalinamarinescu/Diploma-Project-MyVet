const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { petOwnerOnly } = require('../middleware');

// Get all favorite clinics for current user
router.get('/favorites', petOwnerOnly, async (req, res) => {
  const clientId = req.user.id;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_PET_OWNER', clientId)
      .query(`
        SELECT 
          ci.ID_CLINICA as id,
          ci.NAME as name,
          ci.ADRESA as adresa,
          ci.DESCRIERE as descriere,
          (
            SELECT TOP 1 CALE_IMAGINE 
            FROM IMAGINI_CLINICA 
            WHERE ID_CLINICA = ci.ID_CLINICA
          ) AS imagine
        FROM FAVORITE_CLINICS fc
        JOIN CLINIC_INFO ci ON fc.ID_CLINIC = ci.ID_CLINICA
        WHERE fc.ID_PET_OWNER = @ID_PET_OWNER
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET /favorites:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


// Add a clinic to favorites
router.post('/favorites/add', petOwnerOnly, async (req, res) => {
  const clientId = req.user.id;
  const { clinicId } = req.body;
  
  if (!clinicId) return res.status(400).json({ error: 'clinicId lipsă' });

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID_PET_OWNER', clientId)
      .input('ID_CLINIC', clinicId)
      .query(`
        IF NOT EXISTS (
          SELECT 1 FROM FAVORITE_CLINICS WHERE ID_PET_OWNER = @ID_PET_OWNER AND ID_CLINIC = @ID_CLINIC
        )
        INSERT INTO FAVORITE_CLINICS (ID_PET_OWNER, ID_CLINIC)
        VALUES (@ID_PET_OWNER, @ID_CLINIC)
      `);

    res.status(200).json({ message: 'Clinică adăugată la favorite' });
  } catch (err) {
    console.error('Eroare la POST /favorites/add:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

// Remove a clinic from favorites
router.post('/favorites/remove', petOwnerOnly, async (req, res) => {
  const clientId = req.user.id;
  const { clinicId } = req.body;

  if (!clinicId) return res.status(400).json({ error: 'clinicId lipsă' });

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID_PET_OWNER', clientId)
      .input('ID_CLINIC', clinicId)
      .query(`
        DELETE FROM FAVORITE_CLINICS
        WHERE ID_PET_OWNER = @ID_PET_OWNER AND ID_CLINIC = @ID_CLINIC
      `);

    res.status(200).json({ message: 'Clinică ștearsă din favorite' });
  } catch (err) {
    console.error('Eroare la POST /favorites/remove:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

module.exports = router;
