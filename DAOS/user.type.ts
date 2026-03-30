import { Document, Schema } from "mongoose";

export interface User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    designation: "MANAGER" | "TEAM_LEADER" | "DEVELOPER";
    companyId: Schema.Types.ObjectId;
    isVerified: boolean;
    reporters: Schema.Types.ObjectId[];
    code? : number;
}

