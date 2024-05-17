import { Schema, model } from 'mongoose'

interface IMovieSchema {
  name: string
  image: string
  score: number
  genre?: string[]
  synopsis?: string
  createdBy: Schema.Types.ObjectId
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
    score: {
      type: Number,
      required: true,
    },
    genre: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
      },
    ],
    synopsis: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
)

const MovieModel = model<IMovieSchema>('Movie', movieSchema)

export default MovieModel
