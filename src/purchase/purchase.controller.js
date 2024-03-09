import Cart from "../cart/cart.model.js";
import Purchase from "./purchase.model.js";
import Invoice from "../invoice/invoice.model.js";

export const completePurchase = async (req, res) => {
    try {

        if (req.user.role !== 'CLIENT_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to complete purchases."
            });
        }
        const userId = req.user._id;

        // Buscar el carrito del usuario, con status true
        const cart = await Cart.findOne({ userId: userId, status: true }).populate('products.productId');
        console.log('Carrito recuperado:', cart);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Calcular el precio total
        const totalPrice = cart.products.reduce((acc, product) => {
            const productTotal = product.quantity * product.productId.price;
            console.log('Precio del producto:', productTotal);
            return acc + productTotal;
        }, 0);
        console.log('Precio total calculado:', totalPrice);

        // Preparar los productos para la compra
        const productsForPurchase = cart.products.map(product => ({
            productId: product.productId._id, // Asegúrate de que esto es un ObjectId
            quantity: product.quantity,
            price: product.productId.price // Asegúrate de que esto es un número
        }));
        console.log('Productos para la compra:', productsForPurchase);

        // Crear la nueva compra
        const purchase = new Purchase({
            userId: userId,
            products: productsForPurchase, // Asegúrate de que los productos tienen precios asignados
            totalPrice: totalPrice,
            status: 'completed'
        });

        // Guardar la compra en la base de datos
        await purchase.save();
        console.log('Compra completada y guardada:', purchase);

        // Generar la factura
        const invoiceData = {
            invoiceId: purchase._id,
            userId: purchase.userId,
            products: purchase.products.map(product => ({
                productId: product.productId,
                quantity: product.quantity,
                price: product.price,
                total: product.quantity * product.price
            })),
            totalPrice: purchase.totalPrice,
            purchaseDate: purchase.purchaseDate,
            status: purchase.status
        };
        console.log('Factura generada:', invoiceData);

        // Crear un nuevo carrito de compras para el usuario
        const newCart = new Cart({
            userId: userId,
            status: true, // Asume que el nuevo carrito está activo por defecto
            products: [] // Inicialmente, el nuevo carrito no tiene productos
        });

        // Guardar la factura en la base de datos
        const savedInvoice = new Invoice(invoiceData);
        await savedInvoice.save();
        console.log('Factura guardada:', savedInvoice);

        // Guardar el nuevo carrito en la base de datos
        await newCart.save();
        console.log('Nuevo carrito creado:', newCart);

        // Responder con éxito
        res.status(200).json({ message: "Compra completada con éxito", purchase, invoice: savedInvoice, newCart });

    } catch (error) {
        console.error('Error al completar la compra:', error);
        res.status(500).json({ message: "Error al completar la compra", error: error.message });
    }
};


export const getPurchaseHistory = async (req, res) => {
    try {
        if (req.user.role !== 'CLIENT_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to complete this action"
            });
        }
        const userId = req.user._id;
        const purchases = await Purchase.find({ userId: userId }).sort({ purchaseDate: -1 });

        res.status(200).json({ purchases });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al recuperar el historial de compras", error: error.message
        });
    }
};

