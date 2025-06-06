const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../../db');
const { petOwnerOnly } = require('../middleware');

router.get('/my-clinic', petOwnerOnly, async (req, res) => {
  const ownerId = req.user.id;
  const rawClinicId = req.query.clinicId;
  const clinicId = parseInt(rawClinicId);

  if (!clinicId) return res.status(400).json({ error: 'clinicId is required' });

  try {
    const pool = await poolPromise;

    // 1. Preia informațiile despre clinică (indiferent de animale)
    const clinicResult = await pool.request()
      .input('OWNER_ID', ownerId)
      .input('CLINIC_ID', sql.Int, clinicId)
      .query(`
        SELECT 
          C.ID_CLINICA, CI.NAME, C.ADDRESS, CI.DESCRIERE
        FROM PATIENTS_OWNER PO
        JOIN CLINICS C ON C.ID_CLINICA = PO.ID_CLINICA
        LEFT JOIN CLINIC_INFO CI ON CI.ID_CLINICA = C.ID_CLINICA
        WHERE PO.ID_PET_OWNER = @OWNER_ID
        AND PO.ID_CLINICA = @CLINIC_ID
      `);

    if (clinicResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Clinic not found' });
    }

    const clinic = clinicResult.recordset[0];

    // 2. Preia animalele explicit înregistrate în clinică (din PETS_CLINICI)
    const petsResult = await pool.request()
      .input('OWNER_ID', ownerId)
      .input('CLINIC_ID', sql.Int, clinicId)
      .query(`
        SELECT 
          P.ID, P.NUME, P.RASA, P.TIP, P.VARSTA, P.POZA
        FROM PETS_CLINICI PC
        JOIN PETS P ON P.ID = PC.ID_PET
        WHERE PC.ID_CLINICA = @CLINIC_ID
          AND P.ID_PET_OWNER = @OWNER_ID
      `);

    const pets = petsResult.recordset.map(r => ({
      ID: r.ID,
      NUME: r.NUME,
      RASA: r.RASA,
      TIP: r.TIP,
      VARSTA: r.VARSTA,
      POZA: r.POZA
    }));

    // 3. Răspunsul final
    res.json({
      NAME: clinic.NAME,
      ADDRESS: clinic.ADDRESS,
      DESCRIPTION: clinic.DESCRIERE,
      PETS: pets
    });
  } catch (err) {
    console.error('Eroare /my-clinic:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// GET /api/client/pet/:id/medical-record
router.get('/pet/:id/medical-record', petOwnerOnly, async (req, res) => {
  const petId = req.params.id;
  const ownerId = req.user.id;
const rawClinicId = req.query.clinicId;
const clinicId = parseInt(rawClinicId);


  if (!clinicId) return res.status(400).json({ error: 'clinicId is required' });

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('PET_ID', petId)
      .input('OWNER_ID', ownerId)
      .input('CLINIC_ID', sql.Int, clinicId)
      .query(`
        SELECT MR.ID_PET, MR.LAST_CHECKUP_DATE, MR.WEIGHT_KG, MR.SEX, MR.ALLERGIES, MR.NOTES, MR.STATUS,
               P.NUME AS PET_NAME, P.TIP, P.RASA, P.VARSTA, P.POZA
        FROM MEDICAL_RECORD MR
        JOIN PETS P ON P.ID = MR.ID_PET
        WHERE MR.ID_PET = @PET_ID AND P.ID_PET_OWNER = @OWNER_ID AND MR.ID_CLINICA = @CLINIC_ID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'No medical record found or not authorized' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Eroare la medical record:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


// backend/routes/client/medicalRecord.js
router.get('/pet/:id/visits', petOwnerOnly, async (req, res) => {
  const petId = req.params.id;
   const rawClinicId = req.query.clinicId;
const clinicId = parseInt(rawClinicId);


  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', sql.Int, clinicId)
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


// backend/routes/client/medicalRecord.js
router.get('/pet/:id/vaccinations', petOwnerOnly, async (req, res) => {
  const petId = req.params.id;
  const rawClinicId = req.query.clinicId;
const clinicId = parseInt(rawClinicId);


  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', sql.Int, clinicId)
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


// backend/routes/client/medicalRecord.js
router.get('/pet/:id/lab-results', petOwnerOnly, async (req, res) => {
  const petId = req.params.id;
const rawClinicId = req.query.clinicId;
const clinicId = parseInt(rawClinicId);


  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', sql.Int, clinicId)
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


// backend/routes/client/myClinics.js
router.get('/my-clinics', petOwnerOnly, async (req, res) => {
  const ownerId = req.user.id;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('OWNER_ID', ownerId)
      .query(`
        SELECT 
        C.ID_CLINICA,
        CI.NAME,
        C.ADDRESS,
        CI.DESCRIERE,
        C.EMAIL,
        IMG.CALE_IMAGINE
      FROM PATIENTS_OWNER PO
      JOIN CLINICS C ON C.ID_CLINICA = PO.ID_CLINICA
      LEFT JOIN CLINIC_INFO CI ON CI.ID_CLINICA = C.ID_CLINICA
      OUTER APPLY (
        SELECT TOP 1 CALE_IMAGINE
        FROM IMAGINI_CLINICA I
        WHERE I.ID_CLINICA = C.ID_CLINICA
        ORDER BY I.ID
      ) IMG
      WHERE PO.ID_PET_OWNER = @OWNER_ID

      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare my-clinics:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.post('/register-pet-to-clinic', petOwnerOnly, async (req, res) => {
  const { petId, clinicId } = req.body;
  const ownerId = req.user.id;

  try {
    const pool = await poolPromise;

    // Verifică dacă animalul aparține ownerului
    const checkPet = await pool.request()
      .input('ID_PET', petId)
      .input('ID_OWNER', ownerId)
      .query(`
        SELECT 1 FROM PETS
        WHERE ID = @ID_PET AND ID_PET_OWNER = @ID_OWNER
      `);

    if (checkPet.recordset.length === 0) {
      return res.status(400).json({ error: 'Animal invalid sau nu aparține utilizatorului' });
    }

    // Verifică dacă pet-ul e deja înregistrat în clinică în PETS_CLINICI
    const checkAssociation = await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .query(`
        SELECT 1 FROM PETS_CLINICI
        WHERE ID_PET = @ID_PET AND ID_CLINICA = @ID_CLINICA
      `);

    if (checkAssociation.recordset.length > 0) {
      return res.status(400).json({ error: 'Animalul este deja înregistrat în această clinică' });
    }

    // Creează înregistrarea în PETS_CLINICI
    await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .query(`
        INSERT INTO PETS_CLINICI (ID_PET, ID_CLINICA)
        VALUES (@ID_PET, @ID_CLINICA)
      `);

    // Dacă vrei să creezi și fișa medicală automat, poți adăuga și asta:
    await pool.request()
      .input('ID_PET', petId)
      .input('ID_CLINICA', clinicId)
      .query(`
        INSERT INTO MEDICAL_RECORD (ID_PET, ID_CLINICA)
        VALUES (@ID_PET, @ID_CLINICA)
      `);

    res.json({ success: true, message: 'Animal înregistrat în clinică cu succes' });
  } catch (err) {
    console.error('Eroare înscriere animal:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});


// GET /api/client/unregistered-pets?clinicId=123
router.get('/unregistered-pets', petOwnerOnly, async (req, res) => {
  const ownerId = req.user.id;
  const rawClinicId = req.query.clinicId;
  const clinicId = parseInt(rawClinicId);

  if (!clinicId) {
    return res.status(400).json({ error: 'clinicId lipsă' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('OWNER_ID', ownerId)
      .input('CLINIC_ID', clinicId)
      .query(`
        SELECT P.ID, P.NUME, P.RASA, P.TIP, P.VARSTA, P.POZA
        FROM PETS P
        WHERE P.ID_PET_OWNER = @OWNER_ID
          AND NOT EXISTS (
            SELECT 1 FROM MEDICAL_RECORD MR
            WHERE MR.ID_PET = P.ID AND MR.ID_CLINICA = @CLINIC_ID
          )
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la GET /unregistered-pets:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.get('/pet/:petId/records-per-clinic', petOwnerOnly, async (req, res) => {
  const petId = parseInt(req.params.petId);
  const ownerId = req.user.id;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('PET_ID', petId)
      .input('OWNER_ID', ownerId)
      .query(`
        SELECT 
          MR.ID_CLINICA,
          C.NAME,
          C.ADRESA,
          CI.EMAIL,
          V.ID AS VISIT_ID,
          V.TITLE,
          V.VISIT_DATE,
          V.DIAGNOSIS,
          V.TREATMENT,
          V.VETERINARIAN
        FROM MEDICAL_RECORD MR
        JOIN CLINIC_INFO C ON C.ID_CLINICA = MR.ID_CLINICA
        JOIN CLINICS CI ON CI.ID_CLINICA = C.ID_CLINICA
        LEFT JOIN VISITS V ON V.ID_PET = MR.ID_PET AND V.ID_CLINICA = MR.ID_CLINICA
        WHERE MR.ID_PET = @PET_ID
      `);

    // Grupare pe clinică
    const clinics = {};
    for (const row of result.recordset) {
      const id = row.ID_CLINICA;
      if (!clinics[id]) {
        clinics[id] = {
          ID_CLINICA: id,
          NAME: row.NAME,
          ADRESA: row.ADRESA,
          EMAIL: row.EMAIL,
          PHONE: row.PHONE,
          VISITS: []
        };
      }

      if (row.VISIT_ID) {
        clinics[id].VISITS.push({
          ID: row.VISIT_ID,
          TITLE: row.TITLE,
          VISIT_DATE: row.VISIT_DATE,
          DIAGNOSIS: row.DIAGNOSIS,
          TREATMENT: row.TREATMENT,
          TYPE: row.TYPE,
          VETERINARIAN: row.VETERINARIAN
        });
      }
    }

    res.json(Object.values(clinics));
  } catch (err) {
    console.error('Eroare la records-per-clinic:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

module.exports = router;