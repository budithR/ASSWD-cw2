const express = require('express');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require("cors");

const app = express();
const PORT = 3000;

// Enable CORS for your frontend origin
app.use(cors({
  origin: "http://localhost:8081", // Allow Vite dev server
  credentials: true               // Allow cookies/auth headers if needed
}));

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
