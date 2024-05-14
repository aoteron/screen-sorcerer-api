import { Schema, model } from "mongoose";

interface IUserSchema {
    name: String,
    email: String,
    password: String,
    createAt?: Date,
    updateAt?: Date
}

const userSchema = new Schema<IUserSchema> ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createAt: {
        type: String,
        required: false
    },
}, { timestamps: true })

const UserModel = model<IUserSchema>( 'User', userSchema )

export default UserModel;