require('dotenv').config();
const createApp = require('./src/app');

const PORT = process.env.PORT || 5001;
const app = createApp();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});