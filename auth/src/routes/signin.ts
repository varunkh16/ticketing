import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@vkhtickets/common';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', [
    body('email').isEmail().withMessage("Email must be valid!"),
    body('password').trim().notEmpty().withMessage("Password must be provided!")
],
validateRequest, 
async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError("Invalid Credentials");
    }

    const passwordMatch = await Password.compare(existingUser.password, password);
    if(!passwordMatch) {
        throw new BadRequestError("Invalid Credentials");
    }
    
    //Generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!);

    //Store it on the session object
    req.session = {
        jwt: userJwt
    };

    return res.status(201).send(existingUser);
});

export { router as signinRouter };