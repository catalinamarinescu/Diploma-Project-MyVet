const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { poolPromise } = require('./db'); // 👈 corect — extrage direct poolPromise
const { clinicOnly } = require('./routes/middleware'); // middleware-ul tău

// Setare pentru salvare fișiere
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// 🟢 Ruta POST /api/clinic/images
router.post('/images', clinicOnly, upload.array('images'), async (req, res) => {
  try {
    const pool = await poolPromise;
    const clinicID = req.user.id; // Extrage ID-ul din token
    const images = req.files;
    const savedPaths = [];
    
    for (const file of images) {
      const publicPath = file.path.replace(/\\/g, '/');
      savedPaths.push(publicPath);

      await pool.request()
        .input('ID_CLINICA', clinicID)
        .input('CALE_IMAGINE', publicPath)
        .query(`
          INSERT INTO IMAGINI_CLINICA (ID_CLINICA, CALE_IMAGINE)
          VALUES (@ID_CLINICA, @CALE_IMAGINE)
        `);
    }

    res.json({ success: true, imagini: savedPaths });
  } catch (err) {
    console.error('Eroare la upload imagini:', err);
    res.status(500).json({ error: 'Upload eșuat' });
  }
});

router.get('/images', clinicOnly, async (req, res) => {
  try {
    const pool = await poolPromise;
    const clinicID = req.user.id;

    const result = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT CALE_IMAGINE FROM IMAGINI_CLINICA
        WHERE ID_CLINICA = @ID_CLINICA
      `);

    const imagini = result.recordset.map(row => row.CALE_IMAGINE.replace(/\\/g, '/'));
    res.json({ success: true, imagini });
  } catch (err) {
    console.error('Eroare la preluarea imaginilor:', err);
    res.status(500).json({ error: 'Nu s-au putut obține imaginile' });
  }
});


module.exports = router;
