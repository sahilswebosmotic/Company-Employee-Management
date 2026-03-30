import { CompanyModel } from '../models/company.model';
import { Company } from '../daos/company.type';

export class CompanyService {
    async create(data: Partial<Company>) {
        return await CompanyModel.create(data);
    }

    async findAll() {
        return await CompanyModel.find();
    }
}
