import User from '../users/user.model.js';

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

export const existsCategoryId = async (id) => {
    const exist = await Category.findById(id);
    if (!exist) {
        throw new Error(`El id ${id} no existe`);
    }
}