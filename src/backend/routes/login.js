const express = require('express');
const router = express.Router();
const {poolPromise, sql} = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'myvet_super_secret_key1501';

router.post('/loginAsClinic', async(req, res) => {
    const {email, password} = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM CLINICS WHERE Email = @email');

        const clinic = result.recordset[0];
        if (!clinic)
            return res.status(401).json({message: 'Invalid email'});
        const match = await bcrypt.compare(password, clinic.PASSWORD);
        if (!match)
            return res.status(401).json({message: 'Invalid password'});

        const token = jwt.sign (
            {id: clinic.ID_CLINICA, role: 'clinic', name: clinic.Name},
            SECRET_KEY,
            {expiresIn: '2h'}
        );
            
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/loginAsPetOwner', async (req, res) => {
    const { username, password } = req.body;
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query('SELECT * FROM PET_OWNERS WHERE Username = @username');
  
      const user = result.recordset[0];
      if (!user) return res.status(401).json({ message: 'Invalid username' });
  
      const match = await bcrypt.compare(password, user.PASSWORD);
      if (!match) return res.status(401).json({ message: 'Invalid password' });
      const token = jwt.sign(
        { id: user.ID_PET_OWNER, role: 'petowner', username: user.Username },
        SECRET_KEY,
        { expiresIn: '2h' }
      );
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
