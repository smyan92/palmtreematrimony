require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // ✅ import user routes

const app = express();
const path = require('path');

app.use(express.json());

// ==================== Connect MongoDB ====================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ Connection Error:', err));

// ==================== Routes ====================
app.use('/auth', authRoutes);
app.use('/user', userRoutes); // ✅ use user routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// ==================== Start Server ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
