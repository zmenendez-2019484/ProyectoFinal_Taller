import bcrypt from 'bcryptjs';
import User from './user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';

export const register = async (req, res) => {
    try {
        const { name, lastName, age, username, email, password, role } = req.body;
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

export const editUser = async (req, res) => {
    try {
        const { name, lastName, age, username, oldUsername, email, password, oldPassword, role } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);

        // Check if password and oldPassword are not empty
        if (password && oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'The old password is incorrect' });
            }
            if (oldPassword === password) {
                return res.status(400).json({ msg: 'The new password cannot be the same as the old password' });
            }
            user.password = await bcrypt.hash(password, 10);
        }
        // Check if name is not empty
        if (name) {
            user.name = name;
        }

        // Check if lastName is not empty
        if (lastName) {
            user.lastName = lastName;
        }

        // Check if age is not empty
        if (age) {
            user.age = age;
        }
        // Check if username and oldUsername are not empty
        if (username && oldUsername) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists && usernameExists.id !== userId) {
                return res.status(400).json({ msg: 'Username is already in use' });
            }
            const isMatch = await bcrypt.compare(oldUsername, user.username);
            if (!isMatch) {
                return res.status(400).json({ msg: 'The username above is incorrect' });
            }

            user.username = username;
        }
        // Check if email is not empty
        if (email) {
            const userExists = await User.findOne({ email });
            if (userExists && userExists.id !== userId) {
                return res.status(400).json({ msg: 'Email is already in use' });
            }
            user.email = email;
        }
        // Check if role is not empty
        if (role) {
            user.role = role;
        }

        // Guarda los cambios en la base de datos
        await user.save();

        res.status(200).json({
            msg: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to edit user"
        });
    }
}
// Delete user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        user.status = false;
        await user.save();
        res.status(200).json({
            msg: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to delete user"
        });
    }
}