import { CompanyDAO } from '../daos/company.dao';
import { Company } from '../daos/company.type';

const companyDao = new CompanyDAO();

export class CompanyService {
    async create(data: Partial<Company>) {
        return await companyDao.create(data);
    }

    async findAll(filters: any) {
        const { status, email, name, search } = filters;
        let query: any = {};

        if (status) {
            query.status = { $regex: `^${status}$`, $options: 'i' };
        }

        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            const existingOr = query.$or || [];
            query.$or = [
                ...existingOr,
                { name: searchRegex },
                { email: searchRegex },
                { 'address.line1': searchRegex },
                { 'address.line2': searchRegex },
                { 'address.city': searchRegex },
                { 'address.state': searchRegex },
                { 'address.country': searchRegex }
            ];
            
            if (!isNaN(Number(search))) {
                query.$or.push({ 'address.zip': Number(search) });
            }
        }

        return await companyDao.find(query);
    }

    async findById(id: string) {
        return await companyDao.findById(id);
    }

    async update(id: string, data: any) {
        return await companyDao.findByIdAndUpdate(id, data);
    }

    async modify(id: string, data: any) {
        return await companyDao.findByIdAndUpdate(id, { $set: data });
    }

    async delete(id: string) {
        return await companyDao.findByIdAndDelete(id);
    }
}

