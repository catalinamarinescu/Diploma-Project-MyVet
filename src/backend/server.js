const express = require('express');
const cors = require('cors');
const app = express();

const { poolPromise } = require('./db');

const authRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const formRoute = require('./routes/form');

// Middleware
app.use(cors()); // permite cereri de pe alte porturi (ex: React)
app.use(express.json()); // permite parsarea JSON-ului din request body

app.use('/api', authRoutes);
app.use('/api', loginRoutes);
app.use('/api', formRoute);
app.use('/uploads', express.static('uploads'));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server pornit pe http://localhost:${PORT}`);
});
