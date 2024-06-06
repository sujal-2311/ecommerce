import pool from "../config/db.js";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config()


//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
})


export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category_id, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    if (!name || !description || !price || !category_id || !quantity) {
      return res.status(400).send({ error: "All fields are required" });
    }

    if (photo && photo.size > 1000000) {
      return res.status(400).send({ error: "Photo should be less than 1 MB" });
    }

    let photoData = null;

    if (photo) {
      photoData = fs.readFileSync(photo.path);
    }

    const query = `
      INSERT INTO products (name, description, price, category_id, quantity, photo, shipping)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      name,
      description,
      price,
      category_id,
      quantity,
      photoData,
      shipping,
    ];

    const result = await pool.query(query, values);

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await pool.query(
      `SELECT name, description, price, encode(photo, 'base64') AS photo, quantity, category_id, shipping, product_id
             FROM products
             ORDER BY created_at DESC`
    );

    res.status(200).send({
      success: true,
      message: "All products",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product",
    });
  }
};

//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product_id = req.params.id; // Assuming product_id is in req.params
    console.log(product_id);
    const products = await pool.query(
      `SELECT  name, description, price, encode(photo, 'base64') AS photo, quantity, category_id, shipping, product_id FROM products WHERE product_id = $1`,
      [product_id]
    );

    const product = products.rows[0];
    console.log(product);
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.error("Error getting the single product:", error);
    res.status(500).send({
      success: false,
      message: "Error getting the single product",
    });
  }
};

// export const productPhotoController = async (req, res) => {
//   try {
//     const product_id = req.params.id;
//     console.log(product_id);

//     // Fetch the photo data from the database
//     const query = `
//         SELECT encode(photo, 'base64') AS photo
//         FROM products
//         WHERE product_id = $1;
//       `;

//     console.log("Sending Query");

//     const { rows } = await pool.query(query, [product_id]);
//     console.log("Rows: ", rows);

//     const photoData = rows[0];
//     console.log("photodata: ", photoData);

//     // Send the photo data in the response
//     res.status(200).send({
//       success: true,
//       message: "Product photo fetched successfully",
//       photo: photoData,
//     });
//   } catch (error) {
//     console.error("Error fetching product photo:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error fetching product photo",
//       error: error.message,
//     });
//   }
// };

export const deleteProductController = async (req, res) => {
  try {
    const product_id = req.params.id;
    const deleteProductQuery = `DELETE FROM products WHERE product_id = $1;`;

    await pool.query(deleteProductQuery, [product_id]);

    res.status(200).send({
      success: true,
      message: "Product deleted successful",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting product",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category_id, quantity, shipping } =
      req.fields;
    const productId = req.params.id;
    const { photo } = req.files;

    if (!name || !description || !price || !category_id || !quantity) {
      return res.status(400).send({ error: "All fields are required" });
    }

    let photoData = null;
    if (photo) {
      if (photo.size > 1000000) {
        return res
          .status(400)
          .send({ error: "Photo should be less than 1 MB" });
      }
      photoData = fs.readFileSync(photo.path);
    }

    const query = `
        UPDATE products
        SET name = $1, description = $2, price = $3, category_id = $4, quantity = $5, ${
          photo ? "photo = $6," : ""
        } shipping = $${photo ? "7" : "6"}
        WHERE product_id = $${photo ? "8" : "7"}
        RETURNING *
      `;

    const values = [
      name,
      description,
      price,
      category_id,
      quantity,
      ...(photo ? [photoData, shipping, productId] : [shipping, productId]),
    ];

    const { rows, rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      res.status(404).send({
        success: false,
        message: "Product not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Product updated successfully",
        product: rows[0],
      });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
    });
  }
};

//filter
// export const productFilterController = async (req,res) => {
//   try {
//     const {checked, radio} = req.body
//     let args = {}
//     if(checked.length > 0) args.category_id = checked
//     if(radio.length) args.price =
//   } catch (error) {
//     console.log(error)
//     res.status(400).send({
//       success:false,
//       message: "Error while filtering products",
//       error
//     })
//   }
// }

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    console.log(checked, radio);

    let query =
      "SELECT name, description, price, encode(photo, 'base64') AS photo, quantity, category_id, shipping, product_id FROM products";
    let args = [];

    // Construct the WHERE clause for categories
    // if (checked && checked.length > 0){
    //   query += ' WHERE category_array && $1'; // This checks for overlap between arrays
    //   args.push(checked);
    // }

    if (checked && checked.length > 0) {
      // Create a placeholder for each category ID
      const placeholders = checked
        .map((_, index) => `$${index + 1}`)
        .join(", ");
      query += ` WHERE category_id IN (${placeholders})`;
      args.push(...checked);
    }
    // Add price range filter if radio array has exactly one value
    if (radio && radio.length === 2) {
      const a = args.length + 1;
      const b = args.length + 2;
      if (args.length === 0) {
        query += " WHERE";
      } else {
        query += " AND";
      }
      query += ` price >= $${a} AND price <= $${b}`;
      args.push(Number(radio[0]), Number(radio[1])); // Ensure price range values are numbers
    }

    console.log(query, args);

    const { rows } = await pool.query(query, args);
    console.log(rows, "result");

    res.status(200).send({
      success: true,
      products: rows,
    });
  } catch (error) {
    console.error("Error while filtering products:", error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

//product count
export const productCountController = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) AS total FROM products");
    const total = result.rows[0].total;
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

//product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? parseInt(req.params.page, 10) : 1;
    const offset = (page - 1) * perPage;
    const limit = perPage;

    const query = `
        SELECT name, description, price, quantity, category_id, shipping, encode(photo, 'base64') AS photo , product_id
        FROM products
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2;
      `;

    const values = [limit, offset];

    const { rows: products } = await pool.query(query, values);

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(400).send({
      success: false,
      message: "Error in fetching products",
      error,
    });
  }
};

//search product
export const searchProductController = async (req, res) => {
  const { keyword } = req.params;
  const queryText = `
    SELECT name, description, price, encode(photo, 'base64') AS photo, quantity, category_id, shipping, product_id
    FROM products
    WHERE name ILIKE $1
    OR description ILIKE $1;
  `;

  const values = [`%${keyword}%`];
  try {
    const dbRes = await pool.query(queryText, values);
    const products = dbRes.rows;
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(400).send({
      success: false,
      message: "Error in searching products",
      error,
    });
  }
};

//similar products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    
    // Using parameterized query to prevent SQL injection
    const query = {
      text: `
      SELECT name, description, price, encode(photo, 'base64') AS photo, quantity, category_id, shipping, product_id 
      FROM products 
      WHERE category_id = $1 AND product_id != $2 
      LIMIT 3;      
      `,
      values: [cid, pid]
    };

    const result = await pool.query(query);
    const products = result.rows;

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related products",
      error: error.message, // Assuming error.message contains useful information
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req,res) => {
  try {
    gateway.clientToken.generate({}, function(err,response){
      if(err){
        res.status(500).send(err)
      } else{
        res.send(response);
      }
    })
  } catch (error) {
    console.log(error)
  }
}

//payment
export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.forEach(item => {
      total += item.price;
    });

    // Wrap the gateway transaction sale in a Promise
    const salePromise = new Promise((resolve, reject) => {
      gateway.transaction.sale({
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true
        }
      }, (error, result) => {
        if (error) {
          console.error('Braintree payment error:', error);
          reject('Error processing payment');
        } else {
          resolve(result);
        }
      });
    });

    // Use await to get the result of the Promise
    const result = await salePromise;

    if (!result.success) {
      console.error('Braintree transaction failed:', result.message);
      return res.status(500).send('Transaction failed');
    }

    // Extract product IDs and prices from the cart
    const productsData = cart.map(item => ({
      product_id: item.product_id,
      price: item.price,
      name: item.name
    }));

    // Insert order and order products without transaction
    try {
      // Insert order data into the orders table
      const insertOrderText = 'INSERT INTO orders(buyer, payment, products) VALUES($1, $2, $3) RETURNING id';
      const insertOrderValues = [req.user.id, JSON.stringify(result.transaction.id), JSON.stringify(productsData)];
      const resOrder = await pool.query(insertOrderText, insertOrderValues);
      const orderId = resOrder.rows[0].id;

      res.json({ ok: true });
    } catch (e) {
      console.error('Database error:', e);
      res.status(500).send('Error saving the order');
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal server error');
  }
};





