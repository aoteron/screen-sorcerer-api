import { Request, Response } from 'express'
import UserModel from '../models/user.model'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await UserModel.find().populate('movies')
    res.status(200).send(allUsers)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const specificUser = await UserModel.findById({ _id: userId })

    if (!specificUser) {
      return res.status(404).send('User not found')
    }

    res.status(200).send(specificUser)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    const newUser = await UserModel.create({ name, email, password })
    res.status(201).send(newUser)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const { userId } = req.params

  try {
    const userUpdated = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { name, email, password },
      { new: true },
    )
    res.status(201).send(userUpdated)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const userDeleted = await UserModel.findByIdAndDelete({ _id: userId })
    res.status(204).send(userDeleted)
  } catch (error) {
    res.status(400).send(error)
  }
}
