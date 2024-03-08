import Cart from "./cart.model.js";
import Product from "../products/product.model.js";

//add to cart
export const addToCart = async (req, res) => {
    try {
        //jala el id del usuario
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        // Comprueba si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Comprueba si hay suficiente stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }

        // Actualiza el stock del producto
        product.stock -= quantity;
        await product.save();

        // SI no tiene carrito, crea uno
        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            cart = new Cart({ userId: userId });
            await cart.save();
        }

        // Agregar el producto al carrito
        const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (itemIndex >= 0) {
            // Si el producto ya está, se suma la cantidad
            cart.products[itemIndex].quantity += quantity;
        } else {
            // Si no esta, se agrega
            cart.products.push({ productId: productId, quantity });
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


