const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { petOwnerOnly, clinicOnly } = require('../middleware');

router.get('/pets', petOwnerOnly, async (req, res) => {
  const clientId = req.user.id;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('ID_PET_OWNER', clientId)
      .query(`
        SELECT ID, NUME, TIP, RASA, VARSTA, POZA
        FROM PETS
        WHERE ID_PET_OWNER = @ID_PET_OWNER
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET /pets:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/pets', petOwnerOnly, upload.single('poza'), async (req, res) => {
  const clientID = req.user.id;
  const { nume, tip, rasa, varsta } = req.body;
  const pozaPath = req.file?.path.replace(/\\/g, '/');
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID_PET_OWNER', clientID)
      .input('NUME', nume)
      .input('TIP', tip)
      .input('RASA', rasa)
      .input('VARSTA', varsta)
      .input('POZA', pozaPath)
      .query(`
        INSERT INTO PETS (ID_PET_OWNER, NUME, TIP, RASA, VARSTA, POZA)
        VALUES (@ID_PET_OWNER, @NUME, @TIP, @RASA, @VARSTA, @POZA)
      `);

    console.log('File received:', req.file);
    const petsRes = await pool.request()
      .input('ID_PET_OWNER', clientID)
      .query(`SELECT * FROM PETS WHERE ID_PET_OWNER = @ID_PET_OWNER`);

    res.status(200).json(petsRes.recordset);
  } catch (err) {
    console.error('Eroare salvare animal:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


router.put('/pets/:id', petOwnerOnly, upload.single('poza'), async (req, res) => {
  const clientId = req.user.id;
  const petId = req.params.id;
  const { nume, tip, rasa, varsta } = req.body;
  const poza = req.file?.path;

  try {
    const pool = await poolPromise;

    const query = poza
      ? `
          UPDATE PETS SET
            NUME = @NUME,
            TIP = @TIP,
            RASA = @RASA,
            VARSTA = @VARSTA,
            POZA = @POZA
          WHERE ID = @ID AND ID_PET_OWNER = @ID_PET_OWNER
        `
      : `
          UPDATE PETS SET
            NUME = @NUME,
            TIP = @TIP,
            RASA = @RASA,
            VARSTA = @VARSTA
          WHERE ID = @ID AND ID_PET_OWNER = @ID_PET_OWNER
        `;

    const request = pool.request()
      .input('ID', petId)
      .input('ID_PET_OWNER', clientId)
      .input('NUME', nume)
      .input('TIP', tip)
      .input('RASA', rasa)
      .input('VARSTA', varsta);

    if (poza) request.input('POZA', poza);

    await request.query(query);

    const result = await pool.request()
      .input('ID_PET_OWNER', clientId)
      .query(`SELECT ID, NUME, TIP, RASA, VARSTA, POZA FROM PETS WHERE ID_PET_OWNER = @ID_PET_OWNER`);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la PUT /client/pets/:id:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.get('/:id/pets', clinicOnly, async (req, res) => {
  const clientId = req.params.id;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('ID_PET_OWNER', clientId)
      .query(`
        SELECT 
          ID, NUME, TIP, RASA, VARSTA, POZA
        FROM PETS
        WHERE ID_PET_OWNER = @ID_PET_OWNER
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET /client/:id/pets:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.get('/pets/:id/clinics', petOwnerOnly, async (req, res) => {
  const petId = parseInt(req.params.id);

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('PET_ID', petId)
      .query(`
        SELECT CI.ID_CLINICA AS ID, C.NAME AS NUME, C.ADRESA, CI.EMAIL
        FROM PETS_CLINICI PC
        JOIN CLINICS CI ON CI.ID_CLINICA = PC.ID_CLINICA
        JOIN CLINIC_INFO C ON C.ID_CLINICA = CI.ID_CLINICA
        WHERE PC.ID_PET = @PET_ID
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET /pets/:id/clinics:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});



module.exports = router;
