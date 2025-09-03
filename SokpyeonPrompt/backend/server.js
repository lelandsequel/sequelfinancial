const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { db } = require('./config/firebase');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const { webhook } = require('./controllers/paymentController');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user', userRoutes);
app.post('/webhook', bodyParser.raw({type: 'application/json'}), webhook);

// Firebase connection is initialized when required
console.log('Firebase initialized successfully');

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 