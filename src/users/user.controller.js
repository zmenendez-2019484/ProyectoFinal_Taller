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
        const { name, lastName, age, username, email, oldPassword, password} = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Verificar si se proporcionó una nueva contraseña
        if (password) {
            // Verificar si se proporcionó la contraseña antigua y si es correcta
            if (req.body.oldPassword) {
                const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({ msg: 'The old password is incorrect' });
                }
            }
            // Verificar si la nueva contraseña es diferente de la antigua
            if (req.body.oldPassword === password) {
                return res.status(400).json({ msg: 'The new password cannot be the same as the old password' });
            }
            // Actualizar la contraseña
            user.password = await bcrypt.hash(password, 10);
        }

        // Actualizar otros campos si están presentes en req.body
        if (name) user.name = name;
        if (lastName) user.lastName = lastName;

        if (age) {
            //Comprueba si la edad es un número
            if (isNaN(age)) {
                return res.status(400).json({ msg: 'Age must be a number' });
            }
            user.age = parseInt(age, 10);
        }
        
        if (username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists && usernameExists.id !== userId) {
                return res.status(400).json({ msg: 'Username is already in use' });
            }
            user.username = username;
        }
        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists.id !== userId) {
                return res.status(400).json({ msg: 'Email is already in use' });
            }
            user.email = email;
        }

        //Save user
        await user.save();

        res.status(200).json({
            msg: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Failed to edit user', error: error.message });
    }
};

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
};


export const changeUserRole = async (req, res) => {
    try {
        //console.log(req.user);
        // Compprueba si el usuario actual es un administrador
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ msg: 'Not authorized to change user roles' });
        }

        const { userId, newRole } = req.body;

        // Comprueba si el nuevo rol es válido
        if (!['ADMIN_ROLE', 'CLIENT_ROLE'].includes(newRole)) {
            return res.status(400).json({ msg: 'Invalid role' });
        }

        //Comprueba si es el mismo rol
        if (req.user.id === userId && req.user.role === newRole) {
            return res.status(400).json({ msg: 'You cannot change your own role' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        user.role = newRole;
        await user.save();

        res.status(200).json({
            msg: 'User role updated successfully',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to change user role", error: error.message
        });
    }
};

