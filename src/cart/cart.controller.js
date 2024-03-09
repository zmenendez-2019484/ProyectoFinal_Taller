import Cart from "./cart.model.js";
import Product from "../products/product.model.js";

//add to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        // cantidad debe ser un número
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

        // Busca el carrito del usuario con status true
        let cart = await Cart.findOne({ userId: userId, status: true });

        // Busca un carrito inactivo del usuario
        if (!cart) {
            cart = await Cart.findOne({ userId: userId, status: false });
            if (cart) {
                //Lo encuentra, lo activa y lo guarda
                cart.status = true;
                await cart.save();
            } else {
                // SI no encuentra carrito, crea uno nuevo
                cart = new Cart({ userId: userId, status: true });
                await cart.save();
            }
        }

        // Agrega el producto al carrito, si ya está, incrementa la cantidad
        const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (itemIndex >= 0) {
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

        // Buscar el carrito del usuario, con status true
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

//delete cart
export const deleteFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        // Busca el carrito del usuario
        const cart = await Cart.findOne({ userId: userId, status: true });

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        //Encuentra el índice del producto en el carrito
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex < 0) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        //Jala la cantidad del producto en el carrito
        const productQuantity = cart.products[productIndex].quantity;

        // Busca el producto para actualizar su stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        //Aumenta el stock
        product.stock += productQuantity;
        await product.save();

        // Elimina el producto del carrito
        cart.products.splice(productIndex, 1);

        // Comprueba si el carrito está vacío
        if (cart.products.length === 0) {
            cart.status = false;
        }
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

// put cart
export const putCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, newQuantity } = req.body;

        //cantidad debe ser un número
        const newQuantityNumber = parseInt(newQuantity, 10);

        // Busca el carrito del usuario
        const cart = await Cart.findOne({ userId: userId, status: true });

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Encuentra el índice del producto en el carrito
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex < 0) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        //Canridad actual del producto en el carrito
        const currentQuantity = cart.products[productIndex].quantity;

        // Va a buscar el producto para actualizar su stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Cimprueba si la nueva cantidad es mayor o menor que la actual
        if (newQuantityNumber > currentQuantity) {
            // Si la nueva cantidad es mayor, verifica si hay suficiente stock
            if (product.stock < (newQuantityNumber - currentQuantity)) {
                return res.status(400).json({ message: "Stock insuficiente" });
            }
            // Aumenta el stock del producto
            product.stock -= (newQuantityNumber - currentQuantity);
        } else if (newQuantityNumber < currentQuantity) {
            // Si la nueva cantidad es menor, devuelve el stock
            product.stock += (currentQuantity - newQuantityNumber);
        }

        // Actualiza la cantidad 
        cart.products[productIndex].quantity = newQuantityNumber;

        // Guarda los cambios
        await product.save();
        await cart.save();

        res.status(200).json({
            message: "Cantidad de producto actualizada en el carrito", cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al actualizar cantidad de producto en el carrito", error: error.message
        });
    }
};




