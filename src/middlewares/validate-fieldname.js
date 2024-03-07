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

const expectedFieldEdit = ['name', 'lastName','age','username','oldUsername','email', 'password', 'oldPassword', 'role'];
export const validateFieldEdit = (req, res, next) => {
    const body = req.body;
    const fields = Object.keys(body);
    const isValid = fields.every(field => expectedFieldEdit.includes(field));
    if (!isValid) {
        return res.status(400).json({
            msg: 'Invalid field',
            expectedFieldEdit
        });
    }
    next();
};

const expectedFieldChangeRole = ['userId', 'newRole'];
export const validateFieldChangeRole = (req, res, next) => {
    const body = req.body;
    const fields = Object.keys(body);
    const isValid = fields.every(field => expectedFieldChangeRole.includes(field));
    if (!isValid) {
        return res.status(400).json({
            msg: 'Invalid field',
            expectedFieldChangeRole
        });
    }
    next();
};