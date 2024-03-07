import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

CategorySchema.methods.toJSON = function () {
    const {__v, _id, ...category} = this.toObject();
    category.uid = _id;
    return category;
};

const Category = mongoose.model('Category', CategorySchema);
export default Category;
