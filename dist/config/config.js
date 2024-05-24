"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV === 'production') {
    dotenv_1.default.config({ path: '.env.production' });
}
else {
    dotenv_1.default.config({ path: '.env.development' });
}
const ENV = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development';
const CONFIG = {
    development: {
        app: {
            PORT: process.env.PORT || 4004,
        },
        db: {
            URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        },
    },
    production: {
        app: {
            PORT: process.env.PORT || 8008,
        },
        db: {
            URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        },
    },
};
exports.default = CONFIG[ENV];
