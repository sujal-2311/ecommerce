import slugify from "slugify";
import pool from "../config/db.js";

export const CreateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }

    // Check if category already exists
    const existingCategory = await pool.query(
      "SELECT * FROM categories WHERE name = $1",
      [name]
    );
    if (existingCategory.rows.length > 0) {
      return res.status(409).send({
        success: false,
        message: "Category Already Exists",
      });
    }

    // Category does not exist, create a new one
    const slug = slugify(name);
    const newCategoryResult = await pool.query(
      "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *",
      [name, slug]
    );
    res.status(201).send({
      success: true,
      message: "New category created",
      newCategoryResult: newCategoryResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const updateCategoryQuery = `UPDATE categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *;`;

    const { rows } = await pool.query(updateCategoryQuery, [
      name,
      slugify(name),
      id,
    ]);
    const category = rows[0];
    res.status(200).send({
      success: true,
      message: "Category Updated",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

//get all category
export const categoryController = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories;");
    const categories = result.rows; // Extract rows from query result
    res.status(200).send({
      success: true,
      message: "All category list",
      category: categories, // Ensure this is an array of category objects
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all category",
    });
  }
};


//single category
export const singleCategoryController = async (req, res) => {
  try {
    const getOneCategoryQuery = `SELECT * FROM categories WHERE slug = $1;`;

    const { rows } = await pool.query(getOneCategoryQuery, [req.params.slug]);
    const category = rows[0];

    res.status(200).send({
      success: true,
      message: "Single category fetch successful",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all category",
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategoryQuery = `DELETE FROM categories WHERE id = $1;`;

    await pool.query(deleteCategoryQuery, [id]);

    res.status(200).send({
      success: true,
      message: "Category deleted successful"
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting category",
    });
  }
};
