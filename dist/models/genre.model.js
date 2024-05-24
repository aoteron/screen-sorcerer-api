"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreModel = exports.genreSchema = void 0;
const mongoose_1 = require("mongoose");
exports.genreSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    movies: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Movie',
        },
    ],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });
exports.GenreModel = (0, mongoose_1.model)('Genre', exports.genreSchema);
