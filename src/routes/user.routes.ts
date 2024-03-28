import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, updateUser } from '../controllers/user.controllers';

const userRouter = Router();

userRouter.get('/', getAllUsers)
userRouter.post('/', createUser)
userRouter.patch('/', updateUser)
userRouter.delete('/:userId', deleteUser)

export default userRouter