import { UserModel } from '../models/employee.model';

export class EmployeeDAO {
    async findById(id: string) {
        return await UserModel.findById(id);
    }

}
