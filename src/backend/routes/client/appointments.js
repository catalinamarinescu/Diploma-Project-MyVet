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

router.get('/clinic/:clinicId/medici', petOwnerOnly, async (req, res) => {
  const clinicId = parseInt(req.params.clinicId);
  const servicii = req.query.servicii?.split(',').map(Number).filter(Boolean);

  if (!servicii.length) {
    return res.status(400).json({ error: 'Trebuie să specifici serviciile.' });
  }

  try {
    const pool = await poolPromise;
    const placeholders = servicii.map((_, i) => `@S${i}`).join(',');
    const request = pool.request().input('ID_CLINICA', clinicId);
    servicii.forEach((id, i) => request.input(`S${i}`, id));

    const result = await request.query(`
      SELECT A.ID, A.NUME, A.PRENUME, A.TIP_ANGAJAT
      FROM ANGAJATI A
      WHERE A.ID_CLINICA = @ID_CLINICA
        AND A.ID IN (
          SELECT ANGAJAT_ID
          FROM ANGAJATI_SERVICII
          WHERE SERVICIU_ID IN (${placeholders})
          GROUP BY ANGAJAT_ID
          HAVING COUNT(DISTINCT SERVICIU_ID) = ${servicii.length}
        )
    `);

    const medici = result.recordset.map(m => ({
      ID: m.ID,
      FULL_NAME: `${m.PRENUME} ${m.NUME}`,
      TIP_ANGAJAT: m.TIP_ANGAJAT
    }));

    res.json(medici);
  } catch (err) {
    console.error('Eroare SQL filtrare medici:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.get('/angajati/:id/timeslots', petOwnerOnly, async (req, res) => {
 const medicId = parseInt(req.params.id);
  const dateStr = req.query.date;

  if (!medicId || !dateStr) {
    return res.status(400).json({ error: 'Lipsește ID medic sau dată.' });
  }

  const date = new Date(dateStr);
  const weekday = date.getDay() === 0 ? 7 : date.getDay(); // 1=Luni, ..., 7=Duminică
  const timeSlotMin = 30;

  try {
    const pool = await poolPromise;

    const wh = await pool.request()
      .input('ID_MEDIC', medicId)
      .input('WEEKDAY', weekday)
      .query(`
        SELECT
          CONVERT(VARCHAR(5), START_TIME, 108) AS StartTime,
          CONVERT(VARCHAR(5), END_TIME,   108) AS EndTime
        FROM DOCTOR_WORKING_HOURS
        WHERE ID_MEDIC = @ID_MEDIC AND WEEKDAY = @WEEKDAY
      `);

    if (!wh.recordset.length) return res.json([]);

    const startTime = wh.recordset[0].StartTime;
    const endTime = wh.recordset[0].EndTime;

    const toMinutes = t => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const toHM = mins => {
      const h = String(Math.floor(mins / 60)).padStart(2, '0');
      const m = String(mins % 60).padStart(2, '0');
      return `${h}:${m}`;
    };

    const startMin = toMinutes(startTime);
    const endMin = toMinutes(endTime);

    const slots = [];
    for (let m = startMin; m + timeSlotMin <= endMin; m += timeSlotMin) {
      slots.push({ time: toHM(m) });
    }

    const [appointments, exceptions] = await Promise.all([
      pool.request()
        .input('ID_MEDIC', medicId)
        .input('DATE', dateStr)
        .query(`
          SELECT
            P.DATA_ORA_INCEPUT AS [start],
            P.DATA_ORA_SFARSIT AS [end],
            PETS.NUME AS PetName,
            CL.FIRST_NAME + ' ' + CL.LAST_NAME AS OwnerName,
            CL.PHONE AS Phone,
            P.STATUS AS AppointmentStatus,
            P.NOTITE AS Notes,
            P.ID_SERVICE AS ServiceId
          FROM PROGRAMARI P
          JOIN PETS ON P.ID_PET = PETS.ID
          JOIN CLIENT_PROFILE CL ON PETS.ID_PET_OWNER = CL.ID
          WHERE P.ID_MEDIC = @ID_MEDIC AND CAST(P.DATA_ORA_INCEPUT AS DATE) = @DATE

        `),
      pool.request()
        .input('ID_MEDIC', medicId)
        .input('DATE', dateStr)
        .query(`
          SELECT
            ID,
            START_DATE_TIME AS [start],
            END_DATE_TIME   AS [end],
            REASON
          FROM DOCTOR_EXCEPTIONS
          WHERE ID_MEDIC = @ID_MEDIC AND CAST(START_DATE_TIME AS DATE) = @DATE
        `)
    ]);

   const parseDT = s => {
    if (!s) return new Date();

    let dt;
    if (s instanceof Date) {
      dt = s;
    } else if (typeof s === 'string') {
      const cleaned = s.replace('T', ' ').replace('Z', '').split('.')[0];
      const [datePart, timePart] = cleaned.split(' ');
      if (datePart && timePart) {
        const [y, m, d] = datePart.split('-').map(Number);
        const [h, min] = timePart.split(':').map(Number);
        dt = new Date(y, m - 1, d, h, min);
      }
    }

    // rotunjim milisecundele/secundele
    if (dt instanceof Date && !isNaN(dt)) {
      return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), 0, 0);
    }

    return new Date(s);
  };
    
    const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

    for (const slot of slots) {
      const [hour, minute] = slot.time.split(':').map(Number);
      const slotStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute));
      const slotEnd = new Date(slotStart.getTime() + timeSlotMin * 60000);


      // elimină Z (UTC) din datele pentru comparație
      slotStart.setSeconds(0, 0);
      slotEnd.setSeconds(0, 0);
      let matched = false;

      for (const r of appointments.recordset) {
        const start = parseDT(r.start);
        const end = parseDT(r.end);
        if (overlaps(slotStart, slotEnd, start, end)) {
          slot.type = 'booked';
          slot.reason = 'Programare';
          slot.details = {
            time: slot.time,
            petName: r.PetName,
            ownerName: r.OwnerName,
            phone: r.Phone,
            status: r.AppointmentStatus,
            notes: r.Notes,
            serviceId: r.ServiceId
          };
          matched = true;
          break;
        }
      }

      if (matched) continue;

      for (const r of exceptions.recordset) {
        const start = parseDT(r.start);
        const end = parseDT(r.end);
        const rStart = parseDT(r.start);
        const rEnd = parseDT(r.end);
        if (overlaps(slotStart, slotEnd, start, end)) {
          slot.type = 'exception';
          slot.reason = r.REASON || 'Blocare';
          slot.start = r.start;
          slot.end = r.end;     // 👈 NECESAR
          slot.id = r.ID;
          matched = true;
          break;
        }
      }

      if (!matched) {
        slot.type = 'free';
      }
    }

    res.json(slots);
  } catch (err) {
    console.error('Eroare timeslots:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.get('/clinics/:id', petOwnerOnly, async (req, res) => {
  const clinicID = req.params.id;

  try {
    const pool = await poolPromise;

    // 1. Info clinică
    const infoRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT TOP 1 ID_CLINICA, NAME, DESCRIERE, LATITUDINE, LONGITUDINE, ADRESA
        FROM CLINIC_INFO
        WHERE ID_CLINICA = @ID_CLINICA
      `);

    const info = infoRes.recordset[0];
    if (!info) return res.status(404).json({ error: 'Clinică inexistentă' });

    // 2. Imagine (prima din listă)
    const imgRes = await pool.request()
    .input('ID_CLINICA', clinicID)
    .query(`
      SELECT CALE_IMAGINE 
      FROM IMAGINI_CLINICA 
      WHERE ID_CLINICA = @ID_CLINICA
    `);

    const imagini = imgRes.recordset.map(img => img.CALE_IMAGINE.replace(/\\/g, '/'));

    // 3. Servicii
    const servRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT TIP_SERVICIU, DENUMIRE_SERVICIU, PRET, DESCRIERE
        FROM SERVICII
        WHERE ID_CLINICA = @ID_CLINICA
      `);
    const servicii = servRes.recordset.map(s => ({
      tip: s.TIP_SERVICIU,
      denumire: s.DENUMIRE_SERVICIU,
      pret: s.PRET,
      descriere: s.DESCRIERE
    }));

    // 4. Angajați
    const angRes = await pool.request()
      .input('ID_CLINICA', clinicID)
      .query(`
        SELECT NUME, PRENUME, TIP_ANGAJAT, EMAIL, TELEFON, POZA
        FROM ANGAJATI
        WHERE ID_CLINICA = @ID_CLINICA
      `);
    const angajati = angRes.recordset.map(a => ({
      nume: a.NUME,
      prenume: a.PRENUME,
      tip: a.TIP_ANGAJAT,
      email: a.EMAIL,
      telefon: a.TELEFON,
      poza: a.POZA
    }));

    

    // ✔️ Răspuns complet
    res.json({
      id: info.ID_CLINICA,
      name: info.NAME,
      descriere: info.DESCRIERE,
      latitudine: info.LATITUDINE,
      longitudine: info.LONGITUDINE,
      adresa: info.ADRESA,
      imagini,
      servicii,
      angajati
    });

  } catch (err) {
    console.error('Eroare la GET /clinics/:id:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

router.get('/angajati/:id', petOwnerOnly, async (req, res) => {
  const medicId = parseInt(req.params.id);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID', medicId)
      .query(`
        SELECT ID, NUME, PRENUME, TIP_ANGAJAT, EMAIL, TELEFON
        FROM ANGAJATI
        WHERE ID = @ID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Angajat inexistent.' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Eroare la GET /angajati/:id:', err);
    res.status(500).json({ error: 'Eroare server.' });
  }
});


module.exports = router;