import { UserModel } from '../models/employee.model';
import { User } from '../daos/employee.type';

export class EmployeeService {
    async create(data: Partial<User>) {
        return await UserModel.create(data);
    }

    async findAll() {
        return await UserModel.find();
    }
}
