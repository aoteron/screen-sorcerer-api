import { Router } from 'express'
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  checkIfEmailExists,
  loginUser,
} from '../controllers/user.controllers'
import { authenticateToken } from '../services/JWT.middleware'

const userRouter = Router()

userRouter.get('/', getAllUsers)
userRouter.get('/:userId', getUser)
userRouter.post('/check-email', checkIfEmailExists)
userRouter.post('/signup', createUser)
userRouter.post('/login', loginUser)
userRouter.patch('/:userId', authenticateToken, updateUser)
userRouter.delete('/:userId', deleteUser)

export default userRouter
