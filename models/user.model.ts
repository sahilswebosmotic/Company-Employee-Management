import { Schema, model } from "mongoose";
import { User } from "../DAOS/user.type";

const UserSchema = new Schema<User>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        encoded: true   
    },
    designation: {
        type: String,
        required: [true, "Designation is required"],
        enum: ["MANAGER", "TEAM_LEADER", "DEVELOPER"]
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: [true, "Company reference is required"]
    },
    isVerified: {
        type: Boolean,
        required: [true, "Verification status is required"],
        default: false
    },
    reporters: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    code: {
        type: Number
    }
}, { 
    timestamps: true 
});

export const UserModel = model<User>("User", UserSchema);
