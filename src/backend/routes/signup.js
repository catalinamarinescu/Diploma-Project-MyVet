const express = require('express');
const router = express.Router();
const {poolPromise, sql} = require('../db');
const bcrypt = require('bcryptjs');

router.post('/signupAsClinic', async (req, res) => {
    const {name, address, email, password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await poolPromise;
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('address', sql.NVarChar, address)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .query(`INSERT INTO CLINICS (Name, Address, Email, Password)
                    VALUES (@name, @address, @email, @password)`);
        
                    res.status(201).json({message: 'Clinic registered successfully'});
    } catch (err) {
        console.error('Error with registration:', err);
        res.status(500).json({message: 'Server error during resgistration'});
    }
});

router.post('/signupAsPetOwner', async (req, res) => {
  const {username, email, password} = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const pool = await poolPromise;
      await pool.request()
          .input('username', sql.NVarChar, username)
          .input('email', sql.NVarChar, email)
          .input('password', sql.NVarChar, hashedPassword)
          .query(`INSERT INTO PET_OWNERS (Username, Email, Password)
                  VALUES (@username, @email, @password)`);
      
                  res.status(201).json({message: 'User registered successfully'});
  } catch (err) {
      console.error('Error with registration:', err);
      res.status(500).json({message: 'Server error during resgistration'});
  }
});

router.get('/clinics', async (req, res) => {
    try {
      const pool = await poolPromise;
  
      const result = await pool.request()
        .query('SELECT ID_CLINICA, Name, Email, Address FROM Clinics');
  
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error('Error fetching clinics:', err);
      res.status(500).json({ message: 'Server error fetching clinics' });
    }
  });

module.exports = router;