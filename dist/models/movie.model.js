"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Genre',
            required: true,
        },
    ],
    synopsis: {
        type: String,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
const MovieModel = (0, mongoose_1.model)('Movie', movieSchema);
exports.default = MovieModel;
