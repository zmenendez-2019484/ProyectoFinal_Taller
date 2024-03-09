import Invoice from "./invoice.model.js";
import Product from "../products/product.model.js";

export const getUserPurchaseHistory = async (req, res) => {
    try {
        if (req.user.role !== 'CLIENT_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to get purchase history."
            });
        }
        const userId = req.user._id;
        const purchaseHistory = await Invoice.find({ userId: userId }).sort({ purchaseDate: -1 });
        res.status(200).json(purchaseHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al recuperar el historial de compras", error: error.message
        });
    }

};

export const editInvoice = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to edit invoices."
            });
        }
        const { invoiceId, productId, newQuantity } = req.body;

        // Buscar la factura
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }

        // Buscar el producto en la factura
        const productInInvoice = invoice.products.find(product => product.productId.toString() === productId);
        if (!productInInvoice) {
            return res.status(404).json({ message: "Producto no encontrado en la factura" });
        }

        // Validar el stock
        const product = await Product.findById(productId);
        if (product.stock < newQuantity) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }

        // Actualizar la cantidad del producto en la factura
        productInInvoice.quantity = newQuantity;
        productInInvoice.total = newQuantity * productInInvoice.price;

        // Recalcular el total de la factura
        invoice.totalPrice = invoice.products.reduce((total, product) => total + product.total, 0);

        // Actualizar el stock del producto
        product.stock -= (newQuantity - productInInvoice.quantity);
        await product.save();

        // Guardar los cambios en la factura
        await invoice.save();

        res.status(200).json({
            message: "Factura actualizada con éxito", invoice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al editar la factura", error: error.message
        });
    }
};



export const getUserInvoices = async (req, res) => {
    try {

        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to get invoices."
            });
        }
        const userId = req.params.userId;
        const invoices = await Invoice.find({ userId: userId }).sort({ purchaseDate: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al recuperar las facturas del usuario", error: error.message
        });
    }
};

export const getInvoiceDetails = async (req, res) => {
    try {

        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to get invoice details."
            });
        }
        const invoiceId = req.params.invoiceId;
        const invoice = await Invoice.findById(invoiceId).populate('products.productId');
        if (!invoice) {
            return res.status(404).json({
                message: "Factura no encontrada"
            });
        }

        res.status(200).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al recuperar los detalles de la factura",
            error: error.message
        });
    }
};

