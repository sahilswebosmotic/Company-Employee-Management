import { Schema, model } from "mongoose";
import { Company } from "../daos/company.type";

const CompanySchema = new Schema<Company>({
    name: {
        type: String,
        required: [true, "Company name is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Company email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    address: {
        line1: { 
            type: String, 
            required: [true, "Address line 1 is required"] 
        },
        line2: { 
            type: String 
        },
        city: { 
            type: String, 
            required: [true, "City is required"] 
        },
        state: { 
            type: String, 
            required: [true, "State is required"] 
        },
        country: { 
            type: String, 
            required: [true, "Country is required"] 
        },
        zip: { 
            type: Number, 
            required: [true, "Zip code is required"] 
        }
    },
    contact: {
        type: Number,
        required: [true, "Contact number is required"],
        validate: {
            validator: function(v: number) {
                return /^\d{10}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { 
    timestamps: true 
});

export const CompanyModel = model<Company>("Company", CompanySchema);
