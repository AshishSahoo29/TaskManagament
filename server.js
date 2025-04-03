const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:3000', // Allow only frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
const PORT =5000;


connectDB();

const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//import routes
app.use('/api', authRoutes);

app.listen(PORT,'192.168.5.19', () => {
    console.log(`Server running on port ${PORT}`);
});

