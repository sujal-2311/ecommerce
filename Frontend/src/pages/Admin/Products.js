import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  //get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      console.log("Fetched products:", data.products); // Check fetched data
      setProducts(data.products.rows);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  console.log("Products:", products); // Check products state

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row mt-3">
          <div className="col md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Product List</h1>
            <div className="d-flex flex-wrap">
              {products.map((p) => (
                <Link
                  key={p.id}
                  to={`/dashboard/admin/product/${p.product_id}`}
                  className="product-link"
                >
                  <div
                    className="card m-2"
                    style={{ width: "18rem", height: "100%" }}
                    key={p.id}
                  >
                    <img
                      src={`data:image/jpeg;base64,${p.photo}`}
                      className="card-img-top img-fluid"
                      alt={p.name}
                      style={{ height: "200px", objectFit: "cover" }} // Set desired height for the image
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
