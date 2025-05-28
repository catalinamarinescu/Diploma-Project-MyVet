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
        SELECT ID, START_DATE_TIME, END_DATE_TIME, REASON
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
  if (!StartDateTime || !EndDateTime) {
    return res.status(400).json({ error: 'StartDateTime și EndDateTime sunt necesare.' });
  }
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ID_MEDIC', angajatId)
      .input('START_DATE_TIME', sql.DateTime, new Date(StartDateTime))
      .input('END_DATE_TIME',   sql.DateTime, new Date(EndDateTime))
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

module.exports = router;
