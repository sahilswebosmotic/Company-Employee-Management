import { EmployeeModel } from '../models/employee.model';
import { Employee } from '../daos/employee.type';

export class EmployeeService {
    async create(data: Partial<Employee>) {
        return await EmployeeModel.create(data);
    }

    async findAll() {
        return await EmployeeModel.find();
    }
}
