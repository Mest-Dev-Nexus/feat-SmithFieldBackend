import { UserModel } from "../models/userModel";

export const registerUser = async (req, res, next) => {
   
  try {
      const { error, value } = registerUserValidator.validate(req.body);
      if (error) {
        return res.status(422).json(error);
      }
      const user = await UserModel.findOne({
        $or: [{ username: value.username }, { email: value.email }],
      });
      if (user) {
        return res.status(409).json("user already exists");
      }
      const hashedPassword = bcrypt.hashSync(value.password, 10);
      await UserModel.create({
        ...value,
        password: hashedPassword,
      });
        //send registration email to user with html
      await mailTransporter.sendMail({
        from: "trudykingsberry@gmail.com",
        to: value.email,
        subject: "checking out Nodemailer",
        html: registerUserMailTemplate.replace('{{username}}', value.username)
      })
      res.status(201).json("user registered successfully!");
  } catch (error) {
    next(error)
  }
  };



 
  export const loginUser = async (req, res, next) => {

    try {
        const { error, value } = loginUserValidator.validate(req.body);
        if (error) {
          return res.status(422).json(error);
        }
        const user = await UserModel.findOne({
          $or: [{ username: value.username }, { email: value.email }],
        });
        if (!user) {
          return res.status(409).json("user does not exists");
        }
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
          return res.status(401).json("invalid credentials");
        }
        const accessToken = jwt.sign({
          id:user._id
        }, process.env.JWT_SECRET_KEY, {expiresIn: "24h"});
        return res.status(200).json({ accessToken, 
          user: { role: user.role,
            email: user.email
            }
         });
    } catch (error) {
        next(error)
        
    }
  };
  
  

  export const updateUser = async (req, res, next) => {
    const { error, value } = updateUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    const result = await UserModel.findByIdAndUpdate(
      req.params.id,
      value
    )
  
    res.status(200).json(result);
  }