import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';  
import categoryRoutes from './routes/categories'; 
import quizRoutes from './routes/quiz'; 
import progressRoutes from './routes/progress';
import leaderboardRoutes from './routes/leaderboard';
import badgeRoutes from './routes/badges';
import friendRoutes from './routes/friends';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);  
app.use('/api/categories', categoryRoutes); 
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/friends', friendRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Quiz Guru API работает!' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});