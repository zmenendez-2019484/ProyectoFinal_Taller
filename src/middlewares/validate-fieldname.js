const expectedFieldRegister = ['name', 'lastName','age','username','email', 'password', 'role'];

export const validateFieldRegister = (req, res, next) => {
    const body = req.body;
    const fields = Object.keys(body);
    const isValid = fields.every(field => expectedFieldRegister.includes(field));
    if (!isValid) {
        return res.status(400).json({
            msg: 'Invalid field',
            expectedFieldRegister
        });
    }
    next();
};

const expectedFieldLogin = ['username', 'email', 'password'];
export const validateFieldLogin = (req, res, next) => {
    const body = req.body;
    const fields = Object.keys(body);
    const isValid = fields.every(field => expectedFieldLogin.includes(field));
    if (!isValid) {
        return res.status(400).json({
            msg: 'Invalid field',
            expectedFieldLogin
        });
    }
    next();
};