import { CategoryModel } from "../models/category.js";
import { categoryValidator } from "../validators/category.js";


export const createCategory = async (req, res, next) => {
  try {
    const { error, value } = categoryValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }
    const existingCategory = await CategoryModel.findOne({ name: value.name });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const newCategory = await CategoryModel.create(value);

    res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await CategoryModel.findById(req.params.id).lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { error, value } = categoryValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    if (value.name) {
      const existingCategory = await CategoryModel.findOne({
        name: value.name,
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return res
          .status(409)
          .json({ message: "Category name already exists" });
      }
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(
      req.params.id
    ).lean();

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
