require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const clerkAuth = require('./clerkAuth');
const apiRoutes = require('./routes');

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Placeholder route
app.get('/', (req, res) => {
  res.send('Alumni Directory API running');
});

// Example protected route
app.get('/protected', clerkAuth, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.user });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aluminai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
