import express from 'express';
import authRoutes from './features/users/routes/login.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.send('Server is running on port 3000');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});