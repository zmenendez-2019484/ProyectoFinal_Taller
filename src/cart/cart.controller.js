import Cart from "./cart.model.js";
import Product from "../products/product.model.js";

//add to cart
export const addToCart = async (req, res) => {
    try {
        if (req.user.role !== 'CLIENT_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to add cart"
            });
        }

        // Obtiene el ID del usuario
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        // Asegúrate de que la cantidad es un número
        const quantityNumber = parseInt(quantity, 10);

        // Comprueba si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Comprueba si hay suficiente stock
        if (product.stock < quantityNumber) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }

        // Actualiza el stock del producto
        product.stock -= quantityNumber;
        await product.save();

        // Busca el carrito del usuario o crea uno nuevo si no existe
        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            cart = new Cart({ userId: userId });
            await cart.save();
        }

        // Agrega el producto al carrito o actualiza la cantidad si ya está en el carrito
        const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (itemIndex >= 0) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            cart.products[itemIndex].quantity += quantityNumber;
        } else {
            // Si el producto no está en el carrito, lo agrega
            cart.products.push({ productId: productId, quantity: quantityNumber });
        }
        await cart.save();

        res.status(200).json({
            message: "Producto agregado al carrito", cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al agregar producto al carrito", error: error.message
        });
    }
};


//get cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        // Buscar el carrito
        const cart = await Cart.findOne({ userId: userId, status: true }).populate('products.productId');

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al recuperar el carrito" });
    }
};


//remove from cart
export const removeFromCart = async (req, res) => {
    try {
        //jala el id del usuario
        const userId = req.user._id;
        const { productId } = req.body;

        // Busca el carrito
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (itemIndex < 0) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        // Eliminar el producto del carrito
        cart.products.splice(itemIndex, 1);

        // Cambia a false el status del carrito
        cart.status = false;

        await cart.save();

        res.status(200).json({
            message: "Producto eliminado del carrito", cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al eliminar producto del carrito", error: error.message
        });
    }
};

//put cart
export const putCart = async (req, res) => {
    try {
        // Coprubea si el usuario tiene el rol correcto
        if (req.user.role !== 'CLIENT_ROLE') {
            return res.status(401).json({
                msg: "No autorizado para actualizar el carrito"
            });
        }

        // Obtiene el ID del usuario
        const userId = req.user._id;
        const { productId, newQuantity } = req.body;

        // Busca el carrito del usuario
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Busca el producto en el carrito
        const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (itemIndex < 0) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        // Comprueba si hay suficiente stock para la nueva cantidad
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        if (product.stock < newQuantity) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }

        // Actualiza la cantidad del producto en el carrito
        cart.products[itemIndex].quantity = newQuantity;

        // Actualiza el stock del producto
        product.stock -= (newQuantity - cart.products[itemIndex].quantity);
        await product.save();

        // Guarda los cambios en el carrito
        await cart.save();

        res.status(200).json({
            message: "Cantidad de producto actualizada en el carrito",
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al actualizar el carrito",
            error: error.message
        });
    }
};



