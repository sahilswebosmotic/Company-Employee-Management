import { EmployeeDAO } from '../daos/employee.dao';
import { Employee } from '../daos/employee.type';

const employeeDao = new EmployeeDAO();

export class EmployeeService {
    async create(data: Partial<Employee>) {
        return await employeeDao.create(data);
    }

    async findAll(filters: any) {
        const { designation, email, name, search } = filters;
        let matchStage: any = {};

        if (designation) {
            matchStage.designation = { $regex: designation, $options: 'i' };
        }

        if (email) {
            matchStage.email = { $regex: email, $options: 'i' };
        }

        if (name) {
            matchStage.$or = [
                { firstName: { $regex: name, $options: 'i' } },
                { lastName: { $regex: name, $options: 'i' } }
            ];
        }

        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            const existingOr = matchStage.$or || [];
            
            matchStage.$or = [
                ...existingOr,
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { designation: searchRegex }
            ];
        }

        return await employeeDao.find(matchStage);
    }

    async findById(id: string) {
        return await employeeDao.findById(id);
    }

    async update(id: string, data: any) {
        return await employeeDao.findByIdAndUpdate(id, data);
    }

    async modify(id: string, data: any) {
        return await employeeDao.findByIdAndUpdate(id, { $set: data });
    }

    async delete(id: string) {
        return await employeeDao.findByIdAndDelete(id);
    }
}

