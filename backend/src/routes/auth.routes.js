import express from 'express';
import { login, logout, signup, updateProfile, checkAuth } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const routes = express.Router();
routes.post('/signup', signup);
routes.post('/login', login);
routes.post('/logout', logout);
routes.patch('/updateProfile', protectRoute , updateProfile);
routes.get('/check', protectRoute , checkAuth);

export default routes;