import { Schema, model } from 'mongoose'

interface IUserSchema {
  name: String
  email: String
  password: String
  createdAt?: Date
  updatedAt?: Date
}

const userSchema = new Schema<IUserSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true },
)

const UserModel = model<IUserSchema>('User', userSchema)

export default UserModel
