import { EmployeeModel } from '../models/employee.model';
import { Employee } from './employee.type';

export class EmployeeDAO {
    async create(data: Partial<Employee>) {
        return await EmployeeModel.create(data);
    }

    async find(query: any) {
        return await EmployeeModel.find(query);
    }

    async findById(id: string) {
        return await EmployeeModel.findById(id);
    }

    async findByIdAndUpdate(id: string, updateData: any) {
        return await EmployeeModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    }

    async findByIdAndDelete(id: string) {
        return await EmployeeModel.findByIdAndDelete(id);
    }

    async aggregate(pipeline: any[]) {
        return await EmployeeModel.aggregate(pipeline);
    }
}
