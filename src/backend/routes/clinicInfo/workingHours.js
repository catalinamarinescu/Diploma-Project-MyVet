const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../db');
const { clinicOnly } = require('../middleware');
const sql = require('mssql');

// GET existing working hours for a doctor (Angajat)
router.get('/angajati/:id/working-hours', clinicOnly, async (req, res) => {
  const angajatId = parseInt(req.params.id);
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_MEDIC', angajatId)
      .query(`
        SELECT 
          WEEKDAY,
          CONVERT(VARCHAR(5), START_TIME, 108) AS StartTime,
          CONVERT(VARCHAR(5), END_TIME,   108) AS EndTime
        FROM DOCTOR_WORKING_HOURS
        WHERE ID_MEDIC = @ID_MEDIC
        ORDER BY WEEKDAY
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare GET working-hours:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

// POST replace working hours for a doctor
router.post('/angajati/:id/working-hours', clinicOnly, async (req, res) => {
  const angajatId = parseInt(req.params.id);
  const hours = req.body; // expecting array of { weekday, startTime, endTime }

  if (!Array.isArray(hours)) {
    return res.status(400).json({ error: 'Format invalid: aşteptăm un array de obiecte.' });
  }

  try {
    const pool = await poolPromise;
    const trx = await pool.transaction();
    await trx.begin();

    // Șterge vechile ore de lucru
    await trx.request()
      .input('ID_MEDIC', angajatId)
      .query(`DELETE FROM DOCTOR_WORKING_HOURS WHERE ID_MEDIC = @ID_MEDIC`);

    // Inserează noile intervale
    for (const h of hours) {
      // h.weekday, h.startTime, h.endTime
      await trx.request()
        .input('ID_MEDIC', angajatId)
        .input('WEEKDAY', sql.TinyInt, h.weekday)
        .input('START_TIME', sql.NVarChar, h.startTime)
        .input('END_TIME', sql.NVarChar, h.endTime)
        .query(`
          INSERT INTO DOCTOR_WORKING_HOURS (ID_MEDIC, WEEKDAY, START_TIME, END_TIME)
          VALUES (@ID_MEDIC, @WEEKDAY, @START_TIME, @END_TIME)
        `);
    }

    await trx.commit();
    res.json({ success: true, message: 'Program de lucru actualizat.' });
  } catch (err) {
    console.error('Eroare POST working-hours:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

// GET all exceptions for a medic
router.get('/angajati/:id/exceptions', clinicOnly, async (req, res) => {
  const angajatId = parseInt(req.params.id);
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_MEDIC', angajatId)
      .query(`
        SELECT 
          ID,
          CONVERT(VARCHAR, START_DATE_TIME, 126) AS StartDateTime,
          CONVERT(VARCHAR, END_DATE_TIME, 126) AS EndDateTime,
          REASON
        FROM DOCTOR_EXCEPTIONS
        WHERE ID_MEDIC = @ID_MEDIC
        ORDER BY START_DATE_TIME
              `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare GET exceptions:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

// POST add a new exception
router.post('/angajati/:id/exceptions', clinicOnly, async (req, res) => {
  const angajatId = parseInt(req.params.id);
  const { StartDateTime, EndDateTime, Reason } = req.body;
  const parseLocalDateTime = (str) => {
    const [d, t] = str.split(' ');
    const [y, m, day] = d.split('-').map(Number);
    const [h, min] = t.split(':').map(Number);
    return new Date(y, m - 1, day, h, min);
  };


  if (!StartDateTime || !EndDateTime) {
    return res.status(400).json({ error: 'StartDateTime și EndDateTime sunt necesare.' });
  }
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID_MEDIC', angajatId)
      .input('START_DATE_TIME', sql.VarChar, parseLocalDateTime(StartDateTime))
      .input('END_DATE_TIME', sql.VarChar, parseLocalDateTime(EndDateTime))
      .input('REASON',   sql.NVarChar, Reason || null)
      .query(`
        INSERT INTO DOCTOR_EXCEPTIONS (ID_MEDIC, START_DATE_TIME, END_DATE_TIME, REASON)
        VALUES (@ID_MEDIC, @START_DATE_TIME, @END_DATE_TIME, @REASON)
      `);
    res.json({ success: true, message: 'Excepție salvată.' });
  } catch (err) {
    console.error('Eroare POST exceptions:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

// DELETE an exception
router.delete('/exceptions/:excId', clinicOnly, async (req, res) => {
  const excId = parseInt(req.params.excId);
  
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID', excId)
      .query(`DELETE FROM DOCTOR_EXCEPTIONS WHERE ID = @ID`);
    res.json({ success: true, message: 'Excepție ștearsă.' });
  } catch (err) {
    console.error('Eroare DELETE exception:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

// GET /api/clinic/angajati/:id/timeslots?date=YYYY-MM-DD
// ✅ Endpoint /timeslots cu interpretare locală a orei din SQL
router.get('/angajati/:id/timeslots', clinicOnly, async (req, res) => {
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
            DATA_ORA_INCEPUT AS [start],
            DATA_ORA_SFARSIT AS [end]
          FROM PROGRAMARI
          WHERE ID_MEDIC = @ID_MEDIC AND CAST(DATA_ORA_INCEPUT AS DATE) = @DATE
        `),
      pool.request()
        .input('ID_MEDIC', medicId)
        .input('DATE', dateStr)
        .query(`
          SELECT
            START_DATE_TIME AS [start],
            END_DATE_TIME   AS [end],
            REASON
          FROM DOCTOR_EXCEPTIONS
          WHERE ID_MEDIC = @ID_MEDIC AND CAST(START_DATE_TIME AS DATE) = @DATE
        `)
    ]);

    const parseDT = s => {
      if (!s || typeof s !== 'string') return new Date(s);
        const [datePart, timePart] = s.split('T');
        const [y, m, d] = datePart.split('-').map(Number);
        const [h, min] = timePart.split(':').map(Number);
        const dt = new Date();
        dt.setFullYear(y);
        dt.setMonth(m - 1);
        dt.setDate(d);
        dt.setHours(h);
        dt.setMinutes(min);
        dt.setSeconds(0);
        dt.setMilliseconds(0);
        return dt;
      };

    const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

    for (const slot of slots) {
      const [hour, minute] = slot.time.split(':').map(Number);
      const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
      const slotEnd = new Date(slotStart.getTime() + timeSlotMin * 60000);

      let matched = false;

      for (const r of appointments.recordset) {
        const start = parseDT(r.start);
        const end = parseDT(r.end);
        if (overlaps(slotStart, slotEnd, start, end)) {
          slot.type = 'booked';
          slot.reason = 'Programare';
          matched = true;
          break;
        }
      }

      if (matched) continue;

      for (const r of exceptions.recordset) {
        const start = parseDT(r.start);
        const end = parseDT(r.end);
        if (overlaps(slotStart, slotEnd, start, end)) {
          slot.type = 'exception';
          slot.reason = r.REASON || 'Blocare';
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




module.exports = router;
