require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { User, Store, Rating } = require('./models/index'); // auto-imports index.js
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');




const app = express();
app.use(express.json());


const cors = require('cors');
app.use(cors());


// Health check
app.get('/', (req, res) => res.send('Auth API running'));

// Routes
app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.use('/stores', storeRoutes);

app.use('/ratings', ratingRoutes);

// Sync tables then start server
(async () => {
  try {
    await sequelize.sync({ alter: true }); // creates/updates tables as per model
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server listening on ${port}`));
  } catch (e) {
    console.error('Failed to sync DB:', e.message);
    process.exit(1);
  }
})();
