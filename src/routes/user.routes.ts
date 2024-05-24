import { Router } from 'express'
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} from '../controllers/user.controllers'

const userRouter = Router()

userRouter.get('/', getAllUsers)
userRouter.get('/:userId', getUser)
userRouter.post('/signup', createUser)
userRouter.patch('/:userId', updateUser)
userRouter.delete('/:userId', deleteUser)

export default userRouter
