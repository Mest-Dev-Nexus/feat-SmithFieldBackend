import {expressjwt} from 'express-jwt';
import { UserModel } from '../models/userModel.js';

export const isAuthenticated = expressjwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
});

//authorization
export const isAuthorized = (roles) => {
    return async (req, res, next) => {
        const user = await UserModel.findById(req.auth.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if(roles?.includes(user.role)) {
            next();
        }else {
            res.status(403).json({message: 'you are not authorized to access this resource'});
        }
    }
}
