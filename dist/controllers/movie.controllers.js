"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.updateMovie = exports.createMovie = exports.getAllMovies = void 0;
const client_1 = __importDefault(require("../db/client"));
const getAllMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allMovies = yield client_1.default.movie.findMany();
        res.status(201).send(allMovies);
    }
    catch (error) {
        res.status(400).send(`Sorry, there was an error. See more details: ${error}`);
    }
});
exports.getAllMovies = getAllMovies;
const createMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image, score, synopsis, genresIDs } = req.body;
    const { userId } = req.params;
    if (!name || !image || !score) {
        return res.status(400).send(`Sorry, missing fields. Please add a name, image and score`);
    }
    if (!userId) {
        return res.status(400).send(`Sorry, user was not found`);
    }
    try {
        const newMovie = yield client_1.default.movie.create({
            data: {
                name,
                image,
                score,
                synopsis,
                genres: {
                    connect: genresIDs.map((genreId) => ({ id: genreId })),
                },
                user: { connect: { id: userId } },
            },
        });
        res.status(201).send(newMovie);
    }
    catch (error) {
        res.status(400).send(`There was an error creating the movie. See more details: ${error}`);
    }
});
exports.createMovie = createMovie;
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image, score, synopsis, newGenres, deleteGenres } = req.body;
    const { movieId } = req.params;
    if (!name && !image && !score && synopsis && newGenres && deleteGenres) {
        return res.status(400).send(`Any change provided`);
    }
    try {
        const movieUpdated = yield client_1.default.movie.update({
            where: { id: movieId },
            data: {
                name,
                image,
                score,
                synopsis,
                genres: {
                    connect: newGenres === null || newGenres === void 0 ? void 0 : newGenres.map((genreId) => ({ id: genreId })),
                    disconnect: deleteGenres === null || deleteGenres === void 0 ? void 0 : deleteGenres.map((genreId) => ({ id: genreId })),
                },
            },
            include: {
                genres: true,
            },
        });
        res.status(200).send(movieUpdated);
    }
    catch (error) {
        res.status(500).send(`Sorry, there was an error. See more details: ${error}`);
    }
});
exports.updateMovie = updateMovie;
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const movie = yield client_1.default.movie.findUnique({
        where: { id: movieId },
        include: { genres: true },
    });
    if (!movie) {
        return res.status(404).send('Movie not found');
    }
    try {
        const moviesInGenre = yield client_1.default.genre.findMany({
            where: {
                movies: {
                    some: {
                        id: movieId,
                    },
                },
            },
        });
        yield Promise.all(moviesInGenre.map((genre) => __awaiter(void 0, void 0, void 0, function* () {
            yield client_1.default.genre.update({
                where: { id: genre.id },
                data: {
                    movies: {
                        disconnect: {
                            id: movieId,
                        },
                    },
                },
            });
        })));
        yield client_1.default.movie.delete({ where: { id: movieId } });
        res.status(200).send(`Movie successfully deleted`);
    }
    catch (error) {
        res.status(400).send(`Sorry, there was an error. See more details: ${error}`);
    }
});
exports.deleteMovie = deleteMovie;
