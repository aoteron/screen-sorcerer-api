import { Request, Response } from 'express';

export const getAllUsers = (req: Request, res: Response) => {
    res.send('All Users');
}

export const createUser = (req: Request, res: Response) => {
    res.send('User created')
}

export const updateUser = (req: Request, res: Response) => {
    res.send('User updated')
}

export const deleteUser = (req: Request, res: Response) => {
    const {userId} = req.params
    res.send(`User with id '${userId}' has been deleted`)
}