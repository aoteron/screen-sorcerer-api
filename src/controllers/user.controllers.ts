import { Request, Response } from 'express'
import prisma from '../db/client'
import bcrypt from 'bcrypt'

interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        movies: true,
      },
    })
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).send(`No users found`);
    }
    res.status(200).send(allUsers)
  } catch (error) {
    res.status(500).send(`An error occurred while fetching users. See more details: ${error}`)
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const specificUser = await prisma.user.findUnique({
      where: { id: userId},
      include: {
        movies: true
      }
    })

    if (!specificUser) {
      return res.status(404).send('User not found')
    }

    res.status(200).send(specificUser)
  } catch (error) {
    res.status(500).send(`An error occurred while fetching users. See more details: ${error}`)
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).send('All fields are required')
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
    res.status(201).json(`New user successfully created`)
  } catch (error) {
    res.status(400).send(`Sorry, an unexpected error occurred. See more details: ${error}`)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, currentPassword, newPassword } = req.body
  const { userId } = req.params

  if (!name && !email && !newPassword) {
    return res.status(400).send("At least one field (name, email, password) must be provided for update");
}

  try {
    const user = await prisma.user.findUnique({
      where: {id:userId}
    });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (currentPassword) {  
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        return res.status(401).send('Incorrect password')
      }
    }

    const updateData: UserUpdateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (newPassword) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })
    res.status(201).send(`User successfully updated`)
  } catch (error) {
    res.status(400).send(`Sorry, an unexpected error occurred. See more details: ${error}`)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {id: userId},
    });
    if (!user) {
      return res.status(404).send(`User not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).send(`Incorrect password`)
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    res.status(200).send('User deleted successfully')
  } catch (error) {
    res.status(400).send(`An error ocurred while deleting the user. See more details: ${error}`)
  }
}
