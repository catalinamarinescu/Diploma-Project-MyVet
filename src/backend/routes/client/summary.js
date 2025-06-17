const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { petOwnerOnly } = require('../middleware');

router.get('/summary', petOwnerOnly, async (req, res) => {
  const clientId = req.user.id;
  try {
    const pool = await poolPromise;

    const [pets, favorites, appointments] = await Promise.all([
      pool.request()
        .input('ID_PET_OWNER', clientId)
        .query('SELECT COUNT(*) AS total FROM PETS WHERE ID_PET_OWNER = @ID_PET_OWNER'),
      pool.request()
        .input('ID_PET_OWNER', clientId)
        .query('SELECT COUNT(*) AS total FROM FAVORITE_CLINICS WHERE ID_PET_OWNER = @ID_PET_OWNER'),
      pool.request()
        .input('ID_PET_OWNER', clientId)
        .query('SELECT COUNT(*) AS total FROM PROGRAMARI PR JOIN PETS P ON P.ID_PET_OWNER = @ID_PET_OWNER WHERE P.ID = PR.ID_PET AND PR.DATA_ORA_INCEPUT > GETDATE()')
    ]);

    res.json({
      pets: pets.recordset[0].total,
      favorites: favorites.recordset[0].total,
      appointments: appointments.recordset[0].total
    });
  } catch (err) {
    console.error('Eroare la GET /summary:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

module.exports = router;
