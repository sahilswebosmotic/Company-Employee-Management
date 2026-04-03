import { CompanyModel } from '../models/company.model';
import { Company } from './company.type';

export class CompanyDAO {
    async create(data: Partial<Company>) {
        return await CompanyModel.create(data);
    }

    async find(query: any) {
        return await CompanyModel.find(query);
    }

    async findById(id: string) {
        return await CompanyModel.findById(id);
    }

    async findByIdAndUpdate(id: string, updateData: any) {
        return await CompanyModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    }

    async findByIdAndDelete(id: string) {
        return await CompanyModel.findByIdAndDelete(id);
    }

    async aggregate(pipeline: any[]) {
        return await CompanyModel.aggregate(pipeline);
    }
}
