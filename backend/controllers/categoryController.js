const Category = require("../models/categoryModel");

// CREATE
exports.createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.json(category);
};

// READ
exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

// UPDATE
exports.updateCategory = async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// DELETE
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
