const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const journalRoutes = require('./routes/journal');
const contactRoutes = require('./routes/contacts');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cors({
    origin: '*',
    credentials: true,
  }));

  app.use('/users', userRoutes);
  app.use('/journal', journalRoutes);
  app.use('/contacts', contactRoutes);

  return app;
}

module.exports = createApp;