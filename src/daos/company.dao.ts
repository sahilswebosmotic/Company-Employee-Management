import { CompanyModel } from '../models/company.model';

export class CompanyDAO {
    async findById(id: string) {
        return await CompanyModel.findById(id);
    }
}
