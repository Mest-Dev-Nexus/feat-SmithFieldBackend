import { Router } from "express";
import { loginUser, registerUser, updateUser, forgotPassword, resetPassword, getAuthenticatedUser} from "../controllers/user.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { profilePicture } from "../middlewares/upload.js";


export const userRouter = Router();


//define all possible routes
userRouter.post("/user/register", registerUser)

userRouter.post("/user/login", loginUser)

userRouter.put(
    "/user/:id",
    profilePicture.single("profilePicture"),
    isAuthenticated,
    isAuthorized(["Administrator", "Farmer", "Consumer"]), updateUser);
    updateUser

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get('/user/me', isAuthenticated, getAuthenticatedUser )



