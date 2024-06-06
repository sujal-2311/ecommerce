import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from './ProductDetails.module.css'
import { FaCartShopping } from "react-icons/fa6";


const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (params?.id) getProduct();
  }, [params?.product_id]);
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.id}`
      );
      setProduct(data?.product);
      // getSimilarProduct(data?.product.product_id,data?.category_id);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <Layout>
      {/* <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`data:image/jpeg;base64,${product.photo}`}
            className="card-img-top img-fluid"
            alt={product.name}
            style={{ height: "200px", objectFit: "contain" }} // Set desired height for the image
          />
        </div>
        <div className="col-md-6">
          <h1>Product Details</h1>
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>Price: {product.price}</h6>
          <button className="btn btn-secondary ms-1">
          ADD TO CART
        </button>
        </div>
      </div> */}

<div className={styles.container}>
      <div className={styles.card}>
        <div className="container-fliud">
          <div className={`wrapper row ${styles.wrapper}`}>
            <div className={`col-md-6 ${styles.preview}`}>
              <div className={`tab-content ${styles.previewPic}`}>
                <div className={`tab-pane active ${styles.tabPane}`} id="pic-1">
                  <img src={`data:image/jpeg;base64,${product.photo}`} alt="Product" style={{height: "25rem", objectFit: "contain"}} />
                </div>
              </div>
            </div>
            <div className={`col-md-6 justify-content-center ${styles.details}`}>
              <h3 className={styles.productTitle}>{product.name}</h3>
              
              <p className={styles.productDescription}>
                {product.description}
              </p>
              <h4 className={styles.price}>price: <span>Rs. {product.price}</span></h4>

              <div className={styles.action}>
              <button className="btn btn-primary ms-1">
                      ADD TO CART <FaCartShopping />
                    </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



      {/* <div className="row">
        <h1>Similar products</h1>
        {JSON.stringify(relatedProducts,null,4)}
      </div> */}
    </Layout>
  );
};

export default ProductDetails;
