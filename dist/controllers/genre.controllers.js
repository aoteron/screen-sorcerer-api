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
exports.deleteGenre = exports.updateGenre = exports.createGenre = exports.getAllGenres = void 0;
const client_1 = __importDefault(require("../db/client"));
const getAllGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AllGenres = yield client_1.default.genre.findMany();
        res.status(200).send(AllGenres);
    }
    catch (error) {
        res.status(500).send(`Internal server error: ${error}`);
    }
});
exports.getAllGenres = getAllGenres;
const createGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('You did not write the genre name');
    }
    try {
        const genreExists = yield client_1.default.genre.findFirst({ where: { name: name } });
        if (genreExists) {
            return res.status(400).send(`${genreExists} already exists`);
        }
        const newGenre = yield client_1.default.genre.create({ data: { name } });
        res.status(201).send(`New genre '${newGenre.name}' successfully created!`);
    }
    catch (error) {
        res.status(500).send(`Internal server error: ${error}`);
    }
});
exports.createGenre = createGenre;
const updateGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { genreId } = req.params;
    const { name, movies } = req.body; // Next feature: edit movie list when updating de genre
    if (!name) {
        return res.status(400).send(`Ups! You forgot to set a new name`);
    }
    if (!genreId) {
        res.status(400).send(`No genreId was found`);
    }
    try {
        yield client_1.default.genre.update({
            where: { id: genreId },
            data: { name },
        });
        res.status(200).send(`Genre '${name}' successfully updated`);
    }
    catch (error) {
        res.status(400).send(`Sorry, we could not update the genre. More details: ${error}`);
    }
});
exports.updateGenre = updateGenre;
const deleteGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { genreId } = req.params;
    const genre = yield client_1.default.genre.findUnique({
        where: { id: genreId },
        include: { movies: true },
    });
    if (!genre) {
        return res.status(404).send('Genre was not found');
    }
    try {
        const moviesWithGenre = yield client_1.default.movie.findMany({
            where: {
                genres: {
                    some: {
                        id: genreId,
                    },
                },
            },
        });
        yield Promise.all(moviesWithGenre.map((movie) => __awaiter(void 0, void 0, void 0, function* () {
            yield client_1.default.movie.update({
                where: { id: movie.id },
                data: {
                    genres: {
                        disconnect: {
                            id: genreId,
                        },
                    },
                },
            });
        })));
        yield client_1.default.genre.delete({ where: { id: genreId } });
        res.status(201).send(`Genre successfully deleted`);
    }
    catch (error) {
        res.status(500).send(`Internal server error. See more details: ${error}`);
    }
});
exports.deleteGenre = deleteGenre;
