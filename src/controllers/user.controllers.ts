import { Request, Response } from 'express'

export const getAllUsers = (req: Request, res: Response) => {
  res.send('All users')
}

export const getUser = (req: Request, res: Response) => {
  res.send('User info')
}

export const createUser = (req: Request, res: Response) => {
  res.send('User successfully created')
}

export const updateUser = (req: Request, res: Response) => {
  res.send('User updated')
}

export const deleteUser = (req: Request, res: Response) => {
  const { userId } = req.params
  res.send('User deleted')
}
