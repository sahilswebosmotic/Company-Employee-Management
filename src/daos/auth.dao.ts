import { UserModel } from '../models/employee.model';

export class AuthDAO {
    async findByEmail(email: string) {
        return await UserModel.findOne({ email });
    }
}
