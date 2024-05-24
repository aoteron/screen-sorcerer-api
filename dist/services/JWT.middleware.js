"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    console.log('Middleware is called'); // Debugging line
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).send('No token provided');
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Token is not valid');
        }
        const payload = decoded;
        if (payload && payload.id && payload.email) {
            console.log('Payload is valid', payload); // Debugging line
            req.user = { id: payload.id, email: payload.email };
            console.log('User set on request', req.user); // Debugging line
            next();
        }
        else {
            return res.status(403).send('Invalid token structure');
        }
    });
};
exports.authenticateToken = authenticateToken;
