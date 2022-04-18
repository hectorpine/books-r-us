import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from './token.js';
import User from './userAccountSchema.js';

const userRoute = express.Router();

userRoute.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //json=true;
    const dbUser = await User.findOne({ email: req.body.email });
    console.log(dbUser);
    if (dbUser) {
      if (password == dbUser.password) {
        const userAccount = {};
        res.send({
          _id: dbUser._id,
          name: dbUser.name,
          email: dbUser.email,
          isAdmin: dbUser.isAdmin,
          //token: generateToken(dbUser),
        });
        console.log('signed in');
        return;
      }
    }
    //res.status(401).send({ message: 'Invalid email or password' });
  })
);

export default userRoute;
