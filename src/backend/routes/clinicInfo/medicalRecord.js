const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { clinicOnly } = require('../middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/pet/:id/medical-record', clinicOnly, async (req, res) => {
  const petId = req.params.id;
  const clinicId = req.user.id;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .query(`
        SELECT 
          MR.ID,
          MR.LAST_CHECKUP_DATE,
          MR.WEIGHT_KG,
          MR.SEX,
          MR.ALLERGIES,
          MR.NOTES,
          MR.UPDATED_AT,
          MR.STATUS,
          P.NUME AS PET_NAME,
          P.RASA,
          P.TIP,
          P.VARSTA,
          P.POZA,
          CP.FIRST_NAME + ' ' + CP.LAST_NAME AS OWNER_NAME
        FROM PETS P
        LEFT JOIN MEDICAL_RECORD MR ON MR.ID_PET = P.ID AND MR.ID_CLINICA = @ID_CLINICA
        LEFT JOIN CLIENT_PROFILE CP ON CP.ID_PET_OWNER = P.ID_PET_OWNER
        WHERE P.ID = @ID_PET
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Medical record not found for this clinic.' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Eroare la GET /pet/:id/medical-record:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});



router.put('/pet/:id/medical-record', clinicOnly, async (req, res) => {
  const petId = req.params.id;
  const { LAST_CHECKUP_DATE, WEIGHT_KG, SEX, ALLERGIES, NOTES, STATUS } = req.body;
  const clinicId = req.user.id; // 🔑 clinica care face update-ul

  try {
    const pool = await poolPromise;

    const existing = await pool.request()
  .input('ID_PET', petId)
  .input('ID_CLINICA', clinicId)
  .query(`SELECT 1 FROM MEDICAL_RECORD WHERE ID_PET = @ID_PET AND ID_CLINICA = @ID_CLINICA`);


    if (existing.recordset.length === 0) {
      // 👉 Nu există → INSERT
      await pool.request()
        .input('ID_PET', petId)
        .input('LAST_CHECKUP_DATE', LAST_CHECKUP_DATE)
        .input('WEIGHT_KG', WEIGHT_KG)
        .input('SEX', SEX)
        .input('ALLERGIES', ALLERGIES)
        .input('NOTES', NOTES)
        .input('ID_CLINICA', clinicId)
        .input('STATUS', STATUS)
        .query(`
          INSERT INTO MEDICAL_RECORD (ID_PET, LAST_CHECKUP_DATE, WEIGHT_KG, SEX, ALLERGIES, NOTES, ID_CLINICA, STATUS)
          VALUES (@ID_PET, @LAST_CHECKUP_DATE, @WEIGHT_KG, @SEX, @ALLERGIES, @NOTES, @ID_CLINICA, @STATUS)
        `);

      return res.status(201).json({ message: 'Medical record created' });
    }

    // 👉 Există → UPDATE
    await pool.request()
      .input('ID_PET', petId)
      .input('LAST_CHECKUP_DATE', LAST_CHECKUP_DATE)
      .input('WEIGHT_KG', WEIGHT_KG)
      .input('SEX', SEX)
      .input('ALLERGIES', ALLERGIES)
      .input('NOTES', NOTES)
      .input('ID_CLINICA', clinicId)
      .input('STATUS', STATUS)
      .query(`
        UPDATE MEDICAL_RECORD
        SET 
          LAST_CHECKUP_DATE = @LAST_CHECKUP_DATE,
          WEIGHT_KG = @WEIGHT_KG,
          SEX = @SEX,
          ALLERGIES = @ALLERGIES,
          NOTES = @NOTES,
          ID_CLINICA = @ID_CLINICA,
          STATUS = @STATUS
        WHERE ID_PET = @ID_PET
      `);

    res.json({ message: 'Medical record updated' });
  } catch (err) {
    console.error('Eroare la PUT /pet/:id/medical-record:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


// GET all vaccinations for a pet
router.get('/pet/:id/vaccinations', clinicOnly, async (req, res) => {
  const petId = req.params.id;
  const clinicId = req.user.id;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .query(`
        SELECT *
        FROM VACCINATIONS
        WHERE ID_PET = @ID_PET AND ID_CLINICA = @ID_CLINICA
        ORDER BY DATE_ADMINISTERED DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare GET vaccinari:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


// POST - Add new vaccination
router.post('/pet/:id/vaccinations', clinicOnly, async (req, res) => {
  const petId = req.params.id;
  const clinicId = req.user.id;
  const { VACCINE_NAME, DATE_ADMINISTERED, NEXT_DUE_DATE, STATUS } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .input('VACCINE_NAME', VACCINE_NAME)
      .input('DATE_ADMINISTERED', DATE_ADMINISTERED)
      .input('NEXT_DUE_DATE', NEXT_DUE_DATE)
      .input('STATUS', STATUS)
      .query(`
        INSERT INTO VACCINATIONS (ID_PET, ID_CLINICA, VACCINE_NAME, DATE_ADMINISTERED, NEXT_DUE_DATE, STATUS)
        VALUES (@ID_PET, @ID_CLINICA, @VACCINE_NAME, @DATE_ADMINISTERED, @NEXT_DUE_DATE, @STATUS)
      `);
    res.status(201).json({ message: 'Vaccination added' });
  } catch (err) {
    console.error('Eroare POST vaccinari:', err);
    res.status(500).json({ error: 'Eroare la adaugare vaccinare' });
  }
});


// PUT - Update vaccination status
router.put('/vaccinations/:vaccinationId/status', clinicOnly, async (req, res) => {
  const vaccinationId = req.params.vaccinationId;
  const { STATUS } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID', vaccinationId)
      .input('STATUS', STATUS)
      .query(`
        UPDATE VACCINATIONS
        SET STATUS = @STATUS
        WHERE ID = @ID
      `);
    res.json({ message: 'Vaccination status updated' });
  } catch (err) {
    console.error('Eroare PUT status vaccinare:', err);
    res.status(500).json({ error: 'Eroare la actualizare status' });
  }
});


router.get('/pet/:id/visits', clinicOnly, async (req, res) => {
  const petId = req.params.id;
  const clinicId = req.user.id;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .query(`
        SELECT ID, TITLE, VISIT_DATE, DIAGNOSIS, TREATMENT, VETERINARIAN
        FROM VISITS
        WHERE ID_PET = @ID_PET AND ID_CLINICA = @ID_CLINICA
        ORDER BY VISIT_DATE DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET /visits:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


router.post('/pet/:id/visits', clinicOnly, async (req, res) => {
  const petId = req.params.id;
  const clinicId = req.user.id; // preluat din token
  const { title, date, diagnosis, treatment, veterinarian } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .input('TITLE', title)
      .input('VISIT_DATE', date)
      .input('DIAGNOSIS', diagnosis)
      .input('TREATMENT', treatment)
      .input('VETERINARIAN', veterinarian)
      .query(`
        INSERT INTO VISITS (ID_PET, ID_CLINICA, TITLE, VISIT_DATE, DIAGNOSIS, TREATMENT, VETERINARIAN)
        VALUES (@ID_PET, @ID_CLINICA, @TITLE, @VISIT_DATE, @DIAGNOSIS, @TREATMENT, @VETERINARIAN)
      `);

    res.status(201).json({ message: 'Vizită adăugată' });
  } catch (err) {
    console.error('Eroare la POST /visits:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


router.put('/pet/:petId/visits/:visitId', clinicOnly, async (req, res) => {
  const { petId, visitId } = req.params;
  const clinicId = req.user.id;
  const { title, date, diagnosis, treatment, veterinarian } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID_VISIT', visitId)
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .input('TITLE', title)
      .input('VISIT_DATE', date)
      .input('DIAGNOSIS', diagnosis)
      .input('TREATMENT', treatment)
      .input('VETERINARIAN', veterinarian)
      .query(`
        UPDATE VISITS
        SET TITLE = @TITLE,
            VISIT_DATE = @VISIT_DATE,
            DIAGNOSIS = @DIAGNOSIS,
            TREATMENT = @TREATMENT,
            VETERINARIAN = @VETERINARIAN
        WHERE ID = @ID_VISIT AND ID_PET = @ID_PET AND ID_CLINICA = @ID_CLINICA
      `);

    res.json({ message: 'Vizită actualizată' });
  } catch (err) {
    console.error('Eroare la PUT /visits:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


// GET all lab results for a pet
router.get('/pet/:id/lab-results', clinicOnly, async (req, res) => {
  const petId = req.params.id;
  const clinicId = req.user.id;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .query(`
        SELECT * FROM LAB_RESULTS
        WHERE ID_PET = @ID_PET AND ID_CLINICA = @ID_CLINICA
        ORDER BY TEST_DATE DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET lab results:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


// POST a new lab result
router.post('/pet/:id/lab-results', clinicOnly, upload.none(), async (req, res) => {
  const petId = req.params.id;
  const clinicId = req.user.id;
  const { name, date, status, summary } = req.body;

  if (!name || !date) {
    return res.status(400).json({ error: 'Name and date are required' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .input('NAME', name)
      .input('TEST_DATE', date)
      .input('STATUS', status)
      .input('SUMMARY', summary)
      .query(`
        INSERT INTO LAB_RESULTS (ID_PET, ID_CLINICA, NAME, TEST_DATE, STATUS, SUMMARY)
        OUTPUT INSERTED.*
        VALUES (@ID_PET, @ID_CLINICA, @NAME, @TEST_DATE, @STATUS, @SUMMARY)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Eroare la POST lab result:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


// PUT update a lab result
router.put('/pet/:id/lab-results', clinicOnly, upload.none(), async (req, res) => {
  const labId = req.params.id;
  const clinicId = req.user.id;
  const { name, date, status, summary } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID', labId)
      .input('ID_CLINICA', clinicId)
      .input('NAME', name)
      .input('TEST_DATE', date)
      .input('STATUS', status)
      .input('SUMMARY', summary)
      .query(`
        UPDATE LAB_RESULTS
        SET NAME = @NAME,
            TEST_DATE = @TEST_DATE,
            STATUS = @STATUS,
            SUMMARY = @SUMMARY
        WHERE ID = @ID AND ID_CLINICA = @ID_CLINICA
      `);
    res.json({ message: 'Lab result updated' });
  } catch (err) {
    console.error('Eroare la PUT lab result:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


module.exports = router;
