import { EmployeeModel } from '../models/employee.model';

export class AuthDAO {
    async findByEmail(email: string) {
        return await EmployeeModel.findOne({ email });
    }

    async findById(id: string) {
        return await EmployeeModel.findById(id);
    }

    async verifyAccount(id: string) {
        return await EmployeeModel.findByIdAndUpdate(id, { isVerified: true }, { returnDocument: 'after' });
    }

    async create(data: any) {
        return await EmployeeModel.create(data);
    }
}
