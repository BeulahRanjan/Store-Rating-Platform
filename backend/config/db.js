const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('testdb', 'root', 'Coffee_77', {
  host: 'localhost',
  dialect: 'mysql',
   logging: false,
  }
);

// quick connection test (optional; remove in prod)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
  } catch (e) {
    console.error('DB connection error:', e.message);
  }
})();

module.exports = sequelize;