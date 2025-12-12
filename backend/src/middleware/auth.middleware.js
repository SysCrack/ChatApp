import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt_token
        if (!token) {
            return res.status(401).json({message: "Unauthorized token not found"});
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({message: "Unauthorized token not verified"});
        }

        const user = await User.findById(decodedToken.userId).select('-password');
        if (!user) {
            return res.status(401).json({message: "Unauthorized user not found"});
        }
        
        req.user = user;
        next();

    } catch (error) {
        console.error("error in protect route middleware", error.message);
        return res.status(500).json({message : "Internal Server error"});
    }
};