import { Request, Response } from "express";
import { Category } from "../models/category.js";

// Function to generate a random integer from 0 up to (but not including) max
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Controller function to handle the creation of a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Destructure the name and description from the request body
    const { name, description } = req.body;

    // Check if both name and description are provided
    if (!name || !description) {
      // Respond with a 400 status code and an error message if validation fails
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create a new category in the database using the provided name and description
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });

    // Respond with a 200 status code and a success message upon successful creation
    res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the category creation process
    res.status(500).json({
      success: false,
      message: "Error while creating Category",
    });
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    // Extract categoryId from the request parameters
    const { categoryId } = req.params;
    const { name, description } = req.body;

    // Validate that categoryId is provided
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      });
    }

    // Validate that at least one field is provided for update
    if (!name && !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide name or description to update",
      });
    }

    // Find and update the category
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    );

    // Respond with a 404 status code if category not found
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Respond with a 200 status code and the updated category
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    // Handle any errors that occur during the update process
    res.status(500).json({
      success: false,
      message: "Error while updating Category",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    // Extract categoryId from the request parameters
    const { categoryId } = req.params;

    // Validate that categoryId is provided
    if (!categoryId) {
      // Respond with a 400 status code and an error message if validation fails
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      });
    }

    // Delete the category with the specified categoryId from the database
    await Category.findByIdAndDelete(categoryId);

    // Respond with a 200 status code and a success message upon successful deletion
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the deletion process
    res.status(500).json({
      success: false,
      message: "Error while deleting Category",
    });
  }
};

export const showAllCategories = async (req: Request, res: Response) => {
  try {
    // Retrieve all categories from the database with their name and description
    const allCategories = await Category.find(
      {},
      {
        name: true,
        description: true,
      }
    );

    // Respond with a 200 status code and the list of all categories
    res.status(200).json({
      success: true,
      data: allCategories,
      message: "All categories fetched successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the fetching process
    res.status(500).json({
      success: false,
      message: "Error while fetching all categories",
    });
  }
};

export const getCategoryPageDetails = async (req: Request, res: Response) => {
  try {
    // Extract categoryId from the request body
    const { categoryId } = req.body;

    // Find the category by its ID and populate related courses and their rating/reviews
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    // Respond with a 404 status code if the category is not found
    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    console.log(selectedCategory);

    // Respond with a 404 status code if no courses are found for the selected category
    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No courses found for the selected category.",
      });
    }

    // Retrieve categories excluding the currently selected one
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    // Select a random category from the remaining categories
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    // Retrieve all categories with their published courses and instructors
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();

    // Flatten the list of courses from all categories
    const allCourses = allCategories.flatMap((category) => category.courses);

    // Sort courses by the number of sales (sold) in descending order and take the top 10
    const mostSellingCourses = allCourses //@ts-ignore
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // Respond with a 200 status code and the selected category details, different category, and top-selling courses
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
