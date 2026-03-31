import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import companyRoutes from './routes/company.routes';
import employeeRoutes from './routes/employee.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get('/', (req, res) => {
    res.json({ message: 'Company & Employee Management API' });
});

// Future routes will be added here
app.use('/api', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/employees', employeeRoutes);

export default app;
