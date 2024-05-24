"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const movie_routes_1 = __importDefault(require("./routes/movie.routes"));
const genre_routes_1 = __importDefault(require("./routes/genre.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/user', user_routes_1.default);
app.use('/movie', movie_routes_1.default);
app.use('/genre', genre_routes_1.default);
exports.default = app;
