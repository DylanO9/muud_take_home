const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: '*',
    credentials: true,
}));
const userRoutes = require('./routes/users');
const journalRoutes = require('./routes/journal');
const contactRoutes = require('./routes/contacts');

app.use('/api/users', userRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/contacts', contactRoutes);

module.exports = app;