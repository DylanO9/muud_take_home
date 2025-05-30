require('dotenv').config();
const app = require('./src/app');
const http = require('http');

const server = http.createServer(app);

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});