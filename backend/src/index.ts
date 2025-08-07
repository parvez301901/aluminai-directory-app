import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import clerkAuth from './clerkAuth';
import apiRoutes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Placeholder route
app.get('/', (req: Request, res: Response) => {
  res.send('Alumni Directory API running');
});

// Example protected route
app.get('/protected', clerkAuth, (req: Request, res: Response) => {
  res.json({ message: 'You have accessed a protected route!', user: (req as any).user });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aluminai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any).then(() => {
  console.log('MongoDB connected');
}).catch((err: any) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
