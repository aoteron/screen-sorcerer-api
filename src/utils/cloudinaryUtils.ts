import { v2 as cloudinary } from 'cloudinary';
import prisma from '../db/client';

export const renameAndUpdateMovieImage = async (movieId: string, oldFilename: string) => {
  return new Promise(async (resolve, reject) => {
    const public_id = `${movieId}_poster`;
    cloudinary.uploader.rename(oldFilename.split('.')[0], public_id, async (error: any, result: any) => {
      if (error) {
        console.log('Error renaming file:', error);
        return reject('Error renaming file in Cloudinary');
      }
      try {
        const updatedMovie = await prisma.movie.update({
          where: { id: movieId },
          data: { image: result.secure_url },
        });
        resolve(updatedMovie);
      } catch (updateError) {
        console.log('Error updating movie record:', updateError);
        reject('Error updating movie record with new image URL');
      }
    });
  });
};
