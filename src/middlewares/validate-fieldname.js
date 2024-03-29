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

const expectedFieldPostCategory = ['name', 'description'];
export const validateFieldPostCategory = (req, res, next) => {
    const body = req.body;
    const fields = Object.keys(body);
    const isValid = fields.every(field => expectedFieldPostCategory.includes(field));
    if (!isValid) {
        return res.status(400).json({
            msg: 'Invalid field',
            expectedFieldPostCategory
        });
    }
    next();
};

const expectedFieldPostProduct = ['name', 'description', 'price', 'category', 'stock'];
export const validateFieldProduct = (req, res, next) => {
    const body = req.body;
    const fields = Object.keys(body);
    const isValid = fields.every(field => expectedFieldPostProduct.includes(field));
    if (!isValid) {
        return res.status(400).json({
            msg: 'Invalid field',
            expectedFieldPostProduct
        });
    }
    next();
};

const expectedFieldSearchProduct = ['name'];
export const validateFieldSearchProduct = (req, res, next) => {
    const body = req.body;
    const fields = Object.keys(body);
    const isValid = fields.every(field => expectedFieldSearchProduct.includes(field));
    if (!isValid) {
        return res.status(400).json({
            msg: 'Invalid field',
            expectedFieldSearchProduct
        });
    }
    next();
};

const expectedFieldAddCart = ['productId', 'quantity'];
export const validateFieldAddCart = (req, res, next) => {
    const body = req.body;
    const fields = Object.keys(body);
    const isValid = fields.every(field => expectedFieldAddCart.includes(field));
    if (!isValid) {
        return res.status(400).json({
            msg: 'Invalid field',
            expectedFieldAddCart
        });
    }
    next();
};
const expectedFieldEditInvoice = ['invoiceId', 'productId', 'newQuantity'] ;
export const validateFieldEditInvoice = (req, res, next) => {
    const body = req.body;
    const fields = Object.keys(body);
    const isValid = fields.every(field => expectedFieldEditInvoice.includes(field));
    if (!isValid) {
        return res.status(400).json({
            msg: 'Invalid field',
            expectedFieldEditInvoice
        });
    }
    next();
};