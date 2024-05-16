import { Request, Response } from "express";
import { GenreModel } from "../models/genre.model";

export const getAllGenres = async (req: Request, res: Response) => {
    try {
        const AllGenres = await GenreModel.find()
        res.status(200).send(AllGenres)
    } catch(error){
        res.status(400).send(error)
    }
}

export const createGenre = async (req: Request, res: Response) => {
    const { name } = req.body
    const createdBy = req.params.userId

    try {
        const newGenre = await GenreModel.create({ name, createdBy })
        res.status(200).send(`New genre '${newGenre.name}' successfully created!`)
    } catch(error){
        res.status(400).send(error)
    }
}

export const updateGenre = async (req: Request, res: Response) => {
    const { genreId } = req.params
    const { name, movies} = req.body

    try {
        await GenreModel.findByIdAndUpdate(
            { _id: genreId },
            { name, movies },
            {new:true}
        )
        res.status(200).send(`Genre '${name}' successfully updated`)
    }catch(error){
        res.status(400).send(error)
    }
}

export const deleteGenre = async (req: Request, res:Response) => {
    const { genreId } = req.params

    try {
        await GenreModel.findByIdAndDelete({_id:genreId})
        res.status(200).send(`Genre successfully deleted`)
    } catch(error) {
        res.status(400).send(error)
    }
}