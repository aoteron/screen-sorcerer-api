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
exports.deleteUser = exports.updateUser = exports.loginUser = exports.createUser = exports.checkIfEmailExists = exports.getUser = exports.getAllUsers = void 0;
const client_1 = __importDefault(require("../db/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield client_1.default.user.findMany({
            include: {
                movies: true,
            },
        });
        if (!allUsers || allUsers.length === 0) {
            return res.status(404).send(`No users found`);
        }
        res.status(200).send(allUsers);
    }
    catch (error) {
        res.status(500).send(`An error occurred while fetching users. See more details: ${error}`);
    }
});
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const specificUser = yield client_1.default.user.findUnique({
            where: { id: userId },
            include: {
                movies: true,
            },
        });
        if (!specificUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(specificUser);
    }
    catch (error) {
        res.status(500).send(`An error occurred while fetching users. See more details: ${error}`);
    }
});
exports.getUser = getUser;
const checkIfEmailExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield client_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            res.status(200).send({ exists: true });
        }
        else {
            res.status(200).send({ exists: false });
        }
    }
    catch (error) {
        console.error('Error checking email existence:', error);
        res
            .status(500)
            .send(`An error occurred while checking email existence. See more details: ${error}`);
    }
});
exports.checkIfEmailExists = checkIfEmailExists;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send('All fields are required');
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield client_1.default.user.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json(`New user successfully created`);
    }
    catch (error) {
        res.status(400).send(`Sorry, an unexpected error occurred. See more details: ${error}`);
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield client_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }
        const expiresIn = 30;
        const expirationDate = Math.floor(Date.now() / 1000) + expiresIn;
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, exp: expirationDate }, process.env.JWT_SECRET);
        res.status(200).json({
            accessToken: token,
            tokenType: 'Bearer',
            expiresIn: expirationDate,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred during the login process');
    }
});
exports.loginUser = loginUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, currentPassword, newPassword } = req.body;
    const { userId } = req.params;
    if (!name && !email && !newPassword) {
        return res
            .status(400)
            .send('At least one field (name, email, password) must be provided for update');
    }
    try {
        const user = yield client_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).send('User not found');
        }
        if (currentPassword) {
            const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).send('Incorrect password');
            }
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (newPassword) {
            const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
            updateData.password = hashedNewPassword;
        }
        yield client_1.default.user.update({
            where: { id: userId },
            data: updateData,
        });
        res.status(201).send(`User successfully updated`);
    }
    catch (error) {
        res.status(400).send(`Sorry, an unexpected error occurred. See more details: ${error}`);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { password } = req.body;
    try {
        const user = yield client_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).send(`User not found`);
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send(`Incorrect password`);
        }
        yield client_1.default.user.delete({
            where: { id: userId },
        });
        res.status(200).send('User deleted successfully');
    }
    catch (error) {
        res.status(400).send(`An error ocurred while deleting the user. See more details: ${error}`);
    }
});
exports.deleteUser = deleteUser;
