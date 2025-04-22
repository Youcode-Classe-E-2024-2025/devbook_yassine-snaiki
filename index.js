const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
// A test route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
