import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import mongoose from 'mongoose';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 


// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to SmithField-API'))
  .catch(err => console.error('MongoDB connection error:', err));

  

//Routes


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});