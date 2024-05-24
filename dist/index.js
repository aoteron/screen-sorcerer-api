"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const config_1 = __importDefault(require("./config/config"));
const db_1 = __importDefault(require("./db/db"));
const PORT = config_1.default.app.PORT;
(0, db_1.default)().then(() => {
    server_1.default.listen(PORT, () => console.log(`Server running on port ${PORT} and is connected to db`));
});
