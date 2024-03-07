import User from '../users/user.model.js';
import Category from '../category/category.model.js';

export const existsEmail = async (email = '') => {
    const existEmail = await User.findOne({ email });
    if (existEmail) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}

export const existsUsername = async (username = '') => {
    const existUsername = await User.findOne({ username });
    if (existUsername) {
        throw new Error(`El usuario ${username} ya está registrado`);
    }
}

export const existsCategoryId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Failed to validate category' });
    }
};
