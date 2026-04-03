import { Document, Schema } from "mongoose";

export interface Employee extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    designation: "MANAGER" | "TEAM_LEADER" | "DEVELOPER";
    role: "SUPER_ADMIN" | "EMPLOYEE";
    companyId: Schema.Types.ObjectId;
    isVerified: boolean;
    reporters: Schema.Types.ObjectId[];
    code? : number;
}
