import express from 'express';
import validateRoutes from './routes/validateRoutes.js';

const app = express();
app.use(express.json());
app.use('/api', validateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});