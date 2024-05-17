import { Schema, model } from 'mongoose'

interface IGenreSchema {
  name: string
  movies: string[]
  createAt?: Date
  updateAt?: Date
  createdBy?: Schema.Types.ObjectId
}

export const genreSchema = new Schema<IGenreSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    movies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
)

export const GenreModel = model<IGenreSchema>('Genre', genreSchema)
