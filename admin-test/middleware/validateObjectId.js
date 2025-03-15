exports.validateObjectId = (req, res, next) => {
  const { categoryId, subCategoryIds } = req.body;

  if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID format" });
  }

  if (subCategoryIds?.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).json({ message: "Invalid subcategory ID format" });
  }

  next();
};
