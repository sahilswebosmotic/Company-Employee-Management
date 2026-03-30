import { Document } from "mongoose";

export interface Company extends Document {
    name: string;
    email: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        zip: number;
    };
    contact: number;
    status: "ACTIVE" | "INACTIVE";
}
