import express from 'express';
import registerRoutes from './features/users/routes/register.routes';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Server is running on port 3000');
});

app.use(express.json());
app.use('/api', registerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});