import Category from './category.model.js';

//Post Category
export const postCategory = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to create categories"
            });
        }

        const { name, description } = req.body;
        const category = new Category({ name, description });

        await category.save();
        res.status(201).json({
            msg: "Category created successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to create category"
        });
    }
}

// Get all categories with status true
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: true });
        if (categories.length === 0) {
            return res.status(404).json({
                msg: "No categories found"
            });
        }
        res.status(200).json({
            categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to get categories", error: error.message
        });
    }
}

// Get category by id
export const getCategoryById = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to get categories"
            });
        }
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                msg: "Category not found"
            });
        }
        res.status(200).json({
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to get category"
        });
    }
}

// Update category by id
export const updateCategory = async (req, res) => {
    try {
        // Verificar si el usuario es un administrador
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to update categories"
            });
        }

        const { id } = req.params;
        const { name, description } = req.body;

        // Verificar si la categoría existe
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                msg: 'Category not found'
            });
        }

        // Actualizar la categoría si existe
        const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });

        res.status(200).json({
            msg: "Category updated successfully",
            category: updatedCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to update category"
        });
    }
}

