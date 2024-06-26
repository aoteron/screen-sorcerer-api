"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const JWT_middleware_1 = require("../services/JWT.middleware");
const userRouter = (0, express_1.Router)();
userRouter.get('/', user_controllers_1.getAllUsers);
userRouter.get('/:userId', user_controllers_1.getUser);
userRouter.post('/check-email', user_controllers_1.checkIfEmailExists);
userRouter.post('/signup', user_controllers_1.createUser);
userRouter.post('/login', user_controllers_1.loginUser);
userRouter.patch('/:userId', JWT_middleware_1.authenticateToken, user_controllers_1.updateUser);
userRouter.delete('/:userId', user_controllers_1.deleteUser);
exports.default = userRouter;
