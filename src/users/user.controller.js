import bcrypt from 'bcryptjs';
import User from './user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';

export const register = async (req, res) => {
    try {
        const { name, lastName, age, username, email, password,role} = req.body;
        const user = new User({ name, lastName, age, username, email, password, role });
        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        await user.save();
        res.status(201).json({
            msg: "User registered successfully",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to register user"
        });
    }
}

export const login = async (req, res) => {
    try {
        let user;
        //comprueba si mando email
        if (req.body.email) {
            user = await User.findOne({ email: req.body.email });
        }
        //comprueba si mando username
        if (req.body.username) {
            user = await User.findOne({ username: req.body.username });
        }

        // Check if user exists
        if (!user) {
            return res.status(400).json({
                msg: "User does not exist"
            });
        }

        //Check if password is correct
        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Password is not valid"
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id);
        res.status(200).json({
            msg: "User logged in successfully",
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to login"
        });

    }
}