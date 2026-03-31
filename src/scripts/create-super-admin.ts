import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { EmployeeModel } from '../models/employee.model';
import { connectDB } from '../config/db';

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await connectDB();

        const adminData = {
            firstName: "Super",
            lastName: "Admin",
            email: "admin@company.com",
            password: "AdminPassword@123", // Will be hashed by pre-save hook
            designation: "MANAGER",
            role: "SUPER_ADMIN",
            isVerified: true,
            companyId: new mongoose.Types.ObjectId("65f8a0e7d9b3c4001e8a9b21") // Example Company ID
        };

        const existingAdmin = await EmployeeModel.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin already exists.');
            process.exit(0);
        }

        const admin = new EmployeeModel(adminData);
        await admin.save();

        console.log('Super Admin created successfully:');
        console.log(`Email: ${adminData.email}`);
        console.log(`Password: ${adminData.password}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating Super Admin:', error);
        process.exit(1);
    }
};

createSuperAdmin();
