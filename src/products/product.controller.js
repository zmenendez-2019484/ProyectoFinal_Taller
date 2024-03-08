import Product from './product.model.js';
import Category from '../category/category.model.js';

//Post Product
export const postProduct = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to create products"
            });
        }

        if (isNaN(req.body.price) || isNaN(req.body.stock)) {
            return res.status(400).json({
                msg: "Price and stock must be numbers"
            });
        }

        const { name, description, price, category, stock } = req.body;
        const product = new Product({ name, description, price, category, stock });

        await product.save();
        res.status(201).json({
            msg: "Product created successfully",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to create product"
        });
    }
};

// Get all products with status true
export const getProducts = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to get products"
            });
        }

        const products = await Product.find({ status: true });
        if (products.length === 0) {
            return res.status(404).json({
                msg: "No products found"
            });
        }
        res.status(200).json({
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to get products", error: error.message
        });
    }
};

// Get product by id
export const getProductById = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to get products"
            });
        }
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                msg: "Product not found"
            });
        }
        res.status(200).json({
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to get product", error: error.message
        });
    }
};

// Update product by id
export const updateProduct = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to update products"
            });
        }
        const { id } = req.params;
        const { name, description, price, category, stock } = req.body;

        // Comprueba si existe
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                msg: "Product not found"
            });
        }

        // Comprueba si esta false
        if (!product.status) {
            return res.status(404).json({
                msg: "Product is marked as deleted and cannot be updated"
            });
        }

        // Comprueba si el precio y el stock son números
        if (isNaN(price) || isNaN(stock)) {
            return res.status(400).json({
                msg: "Price and stock must be numbers"
            });
        }


        // Actualiza el producto
        const updatedProduct = await Product.findByIdAndUpdate(id,
            { name, description, price, category, stock }, { new: true });

        res.status(200).json({
            msg: "Product updated successfully",
            updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to update product", error: error.message
        });
    }
};

//Control inventory
export const controlInventory = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to control inventory"
            });
        }
        const { id } = req.params;
        const { stock } = req.body;

        // Comprueba si el producto existe
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                msg: "Product not found"
            });
        }

        // Comprueba si esta false
        if (!product.status) {
            return res.status(404).json({
                msg: "Product is marked as deleted and cannot be updated"
            });
        }

        if (isNaN(stock)) {
            return res.status(400).json({
                msg: "Stock must be a number"
            });
        }

        // Actualiza el stock
        const updatedProduct = await Product.findByIdAndUpdate(id, { stock }, { new: true });

        res.status(200).json({
            msg: "Stock updated successfully",
            updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to update stock", error: error.message
        });
    }
};

//Out of stock
export const getOutOfStockProducts = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to get out of stock products"
            });
        }
        const products = await Product.find({ stock: 0 });
        res.status(200).json({
            msg: "Out of stock products",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to get out of stock products", error: error.message
        });
    }
};

// Best selling products
export const getBestSellingProducts = async (req, res) => {
    try {

        // selecciona productos cuyo campo sold es mayor que 0
        const products = await Product.find({ sold: { $gt: 0 } }).
            //sort by sold in descending order and limit to 3
            sort({ sold: -1 }).limit(3);
        if (products.length === 0) {
            return res.status(404).json({
                msg: "No products have been sold yet"
            });
        }
        res.status(200).json({
            msg: "Top 3 best selling products",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to get best selling products", error: error.message
        });
    }
};


//Delete product by id
export const deleteProduct = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to delete products"
            });
        }

        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                msg: "Product not found"
            });
        }
        product.status = false;
        await product.save();
        res.status(200).json({
            msg: "Product marked as deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to mark product as deleted", error: error.message
        });
    }
};

// Search products by name
export const searchProducts = async (req, res) => {
    try {

        if (req.user.role !== 'CLIENT_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to search products"
            });
        }

        const { name } = req.query;

        // Busca productos que contengan el nombre
        // $regex expresion que busca coincidencias
        // $options para que no sea sensible a mayusculas y minusculas
        const products = await Product.find({ name: { $regex: name, $options: 'i' } });

        // Comprueba si no hay productos
        if (products.length === 0) {
            return res.status(404).json({
                msg: "No products found"
            });
        }
        // Muestra los productos encontrados
        res.status(200).json({
            msg: "Products found",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to search products", error: error.message
        });
    }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
    try {

        if (req.user.role !== 'CLIENT_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to view products by category"
            });
        }

        const { categoryId } = req.params;

        // Comprueba si la categoría existe
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                msg: "Category not found"
            });
        }

        const products = await Product.find({ category: categoryId });

        // Comprueba si hay productos
        if (products.length === 0) {
            return res.status(404).json({
                msg: "No products found for this category"
            });
        }

        res.status(200).json({
            msg: "Products by category",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to get products by category"
        });
    }
};





