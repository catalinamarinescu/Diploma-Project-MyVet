const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { petOwnerOnly } = require('../middleware');

router.post('/appointments', petOwnerOnly, async (req, res) => {
  const {
    id_pet,
    id_clinica,
    id_medic,
    data_start,
    data_end,
    servicii,
    notite
  } = req.body;

  if (!Array.isArray(servicii) || servicii.length === 0) {
    return res.status(400).json({ error: 'Selectează cel puțin un serviciu.' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('ID_PET', id_pet)
      .input('ID_CLINICA', id_clinica)
      .input('ID_MEDIC', id_medic)
      .input('DATA_ORA_INCEPUT', data_start)
      .input('DATA_ORA_SFARSIT', data_end)
      .input('NOTITE', notite || '')
      .query(`
        INSERT INTO PROGRAMARI (ID_PET, ID_CLINICA, ID_MEDIC, DATA_ORA_INCEPUT, DATA_ORA_SFARSIT, NOTITE)
        OUTPUT INSERTED.ID
        VALUES (@ID_PET, @ID_CLINICA, @ID_MEDIC, @DATA_ORA_INCEPUT, @DATA_ORA_SFARSIT, @NOTITE)
      `);

    const programareId = result.recordset[0].ID;

    for (const id_serviciu of servicii) {
      await pool.request()
        .input('ID_PROGRAMARE', programareId)
        .input('ID_SERVICIU', id_serviciu)
        .query(`
          INSERT INTO PROGRAMARI_SERVICII (ID_PROGRAMARE, ID_SERVICIU)
          VALUES (@ID_PROGRAMARE, @ID_SERVICIU)
        `);
    }

    res.status(201).json({ message: 'Programare creată cu succes.' });
  } catch (err) {
    console.error('Eroare la creare programare:', err);
    res.status(500).json({ error: 'Eroare server.' });
  }
});

router.get('/appointments', petOwnerOnly, async (req, res) => {
  const clientId = req.user.id;
  const status = req.query.status; // ex: ?status=programata

  try {
    const pool = await poolPromise;
    const request = pool.request()
      .input('ID_PET_OWNER', clientId);

    let query = `
      SELECT 
        P.ID,
        P.DATA_ORA_INCEPUT,
        P.DATA_ORA_SFARSIT,
        P.STATUS,
        P.NOTITE,
        PETS.NUME AS NUME_ANIMAL,
        A.NUME AS NUME_MEDIC,
        A.PRENUME AS PRENUME_MEDIC,
        C.NUME AS NUME_CLINICA
      FROM PROGRAMARI P
      INNER JOIN PETS ON P.ID_PET = PETS.ID
      INNER JOIN ANGAJATI A ON P.ID_MEDIC = A.ID
      INNER JOIN CLINICI C ON P.ID_CLINICA = C.ID
      WHERE PETS.ID_PET_OWNER = @ID_PET_OWNER
    `;

    if (status) {
      query += ' AND P.STATUS = @STATUS';
      request.input('STATUS', status);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET /programari:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

// Public: lista serviciilor pentru orice clinică, pe baza ID-ului
router.get('/clinic/:id/servicii', async (req, res) => {
  const clinicId = parseInt(req.params.id);
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_CLINICA', clinicId)
      .query(`
        SELECT
          ID,
          TIP_SERVICIU AS tip,
          DENUMIRE_SERVICIU AS denumire,
          DESCRIERE AS descriere,
          PRET AS pret,
          DURATA AS durata
        FROM SERVICII
        WHERE ID_CLINICA = @ID_CLINICA
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare GET /clinic/:id/servicii:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


module.exports = router;