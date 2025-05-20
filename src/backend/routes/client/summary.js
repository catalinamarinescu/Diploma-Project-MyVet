const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { petOwnerOnly } = require('../middleware');

router.get('/summary', petOwnerOnly, async (req, res) => {
  const clientId = req.user.id;
  try {
    const pool = await poolPromise;

    const [pets, favorites] = await Promise.all([
      pool.request()
        .input('ID_PET_OWNER', clientId)
        .query('SELECT COUNT(*) AS total FROM PETS WHERE ID_PET_OWNER = @ID_PET_OWNER'),
      pool.request()
        .input('ID_PET_OWNER', clientId)
        .query('SELECT COUNT(*) AS total FROM FAVORITE_CLINICS WHERE ID_PET_OWNER = @ID_PET_OWNER')
    ]);

    res.json({
      pets: pets.recordset[0].total,
      favorites: favorites.recordset[0].total
    });
  } catch (err) {
    console.error('Eroare la GET /summary:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

module.exports = router;
