const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { petOwnerOnly } = require('../middleware');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/profile_images',
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

/**
 * GET /client/profile
 */
router.get('/profile', petOwnerOnly, async (req, res) => {
  const clientId = req.user.id;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('ID_PET_OWNER', clientId)
      .query(`
       SELECT 
        cp.FIRST_NAME, 
        cp.LAST_NAME, 
        cp.PHONE, 
        cp.ADDRESS, 
        cp.IMAGE,
        cp.CREATED_AT,
        po.EMAIL
      FROM CLIENT_PROFILE cp
      JOIN PET_OWNERS po ON cp.ID_PET_OWNER = po.ID_PET_OWNER
      WHERE cp.ID_PET_OWNER = @ID_PET_OWNER
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Profilul nu există' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Eroare la GET /client/profile:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

/**
 * POST /client/profile – creare profil
 */
router.post('/profile', petOwnerOnly, upload.single('image'), async (req, res) => {
  const clientId = req.user.id;
  const { first_name, last_name, phone, address } = req.body;
  const image = req.file?.path.replace(/\\/g, '/');

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('ID_PET_OWNER', clientId)
      .input('FIRST_NAME', first_name)
      .input('LAST_NAME', last_name)
      .input('PHONE', phone)
      .input('ADDRESS', address)
      .input('IMAGE', image || null)
      .query(`
        INSERT INTO CLIENT_PROFILE (ID_PET_OWNER, FIRST_NAME, LAST_NAME, PHONE, ADDRESS, IMAGE)
        VALUES (@ID_PET_OWNER, @FIRST_NAME, @LAST_NAME, @PHONE, @ADDRESS, @IMAGE)
      `);

    res.status(201).json({ message: 'Profil creat cu succes' });
  } catch (err) {
    console.error('Eroare la POST /client/profile:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

/**
 * PUT /client/profile – actualizare profil
 */
router.put('/profile', petOwnerOnly, upload.single('image'), async (req, res) => {
  const clientId = req.user.id;
  const { first_name, last_name, phone, address } = req.body;
  const image = req.file?.path.replace(/\\/g, '/');

  try {
    const pool = await poolPromise;

    // Verifică dacă există deja profilul
    const existing = await pool.request()
      .input('ID_PET_OWNER', clientId)
      .query(`SELECT 1 FROM CLIENT_PROFILE WHERE ID_PET_OWNER = @ID_PET_OWNER`);

    if (existing.recordset.length === 0) {
      // Nu există – creează unul nou
      await pool.request()
        .input('ID_PET_OWNER', clientId)
        .input('FIRST_NAME', first_name)
        .input('LAST_NAME', last_name)
        .input('PHONE', phone)
        .input('ADDRESS', address)
        .input('IMAGE', image || null)
        .query(`
          INSERT INTO CLIENT_PROFILE (ID_PET_OWNER, FIRST_NAME, LAST_NAME, PHONE, ADDRESS, IMAGE)
          VALUES (@ID_PET_OWNER, @FIRST_NAME, @LAST_NAME, @PHONE, @ADDRESS, @IMAGE)
        `);

      return res.status(201).json({ message: 'Profil creat cu succes', imagePath: image });
    }

    // Există – fă update
    const request = pool.request()
      .input('ID_PET_OWNER', clientId)
      .input('FIRST_NAME', first_name)
      .input('LAST_NAME', last_name)
      .input('PHONE', phone)
      .input('ADDRESS', address);

    if (image) {
      request.input('IMAGE', image);
    }

    await request.query(`
      UPDATE CLIENT_PROFILE
      SET FIRST_NAME = @FIRST_NAME,
          LAST_NAME = @LAST_NAME,
          PHONE = @PHONE,
          ADDRESS = @ADDRESS
          ${image ? ', IMAGE = @IMAGE' : ''}
      WHERE ID_PET_OWNER = @ID_PET_OWNER
    `);

    res.json({ message: 'Profil actualizat', imagePath: image });

  } catch (err) {
    console.error('Eroare la PUT /client/profile:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

module.exports = router;
