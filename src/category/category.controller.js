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
        if (!categories) {
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
            msg: "Failed to get categories"
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
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: "Not authorized to update categories"
            });
        }
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        res.status(200).json({
            msg: "Category updated successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to update category"
        });
    }
}
