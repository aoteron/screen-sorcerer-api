import { Schema, model } from 'mongoose'

interface IMovieSchema {
  name: string
  image: string
  createAt?: Date
  updateAt?: Date
}

const movieSchema = new Schema<IMovieSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const MovieModel = model<IMovieSchema>('Movie', movieSchema)

export default MovieModel
