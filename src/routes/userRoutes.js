import { Router } from "express";
import { loginUser, registerUser, updateUser } from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";


const userRouter = Router();





//define all possible routes
userRouter.post("/user/register", registerUser)

userRouter.post("/user/login", loginUser)

userRouter.patch('/users/:id',isAuthenticated,
    isAuthorized(["Administrator", "Farmer", "Consumer"]), updateUser);



export default userRouter;