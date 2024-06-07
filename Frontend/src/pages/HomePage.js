import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdReadMore } from "react-icons/md";
import { useCart } from "../context/cart";
import { FaCartShopping } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import {
  Navigation,
  Pagination,
  Scrollbar,
  Autoplay,
  EffectFade,
} from "swiper/modules";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart()
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Filter products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle filter change
  const handleFilter = (value, id) => {
    if (value) {
      setChecked((prevChecked) => [...prevChecked, id]);
    } else {
      setChecked((prevChecked) => prevChecked.filter((c) => c !== id));
    }
  };

  useEffect(() => {
    if (!checked.length || !radio.length) {
      getAllProducts();
    }
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    }
  }, [checked, radio]);

  function handleRedirect(id) {
    navigate(`/product/${id}`);
  }

  return (
    <Layout>
      <Swiper
        // spaceBetween={50}
        modules={[Navigation, Pagination, Scrollbar, Autoplay, EffectFade]}
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        loop
      >
        <SwiperSlide>
          <img src="/images/swipper1.webp" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/swipper2.webp" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/swipper3.webp" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/swipper4.webp" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/swipper5.webp" />
        </SwiperSlide>
      </Swiper>
      <div className="row mt-3">
        <div className="col-md-3 d-flex flex-column justify-content-center">
          <h4 className="text-center">Filters By Category</h4>
          <div className="d-flex flex-column p-3">
            {categories?.map((c) => (
              <Checkbox
                key={c.id}
                onChange={(e) => handleFilter(e.target.checked, c.id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filters By Price</h4>
          <div className="d-flex flex-column p-3">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p.id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column p-3">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap justify-content-center">
            {products?.map((p) => (
              <div
                className="card m-2"
                style={{ width: "18rem", height: "100%" }}
                key={p.id}
              >
                <img
                  src={`data:image/jpeg;base64,${p.photo}`}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "contain" }}
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text"> Rs. {p.price}</p>
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-info ms-1 mb-3"
                      onClick={() => handleRedirect(p.product_id)}
                    >
                      More Details <MdReadMore />
                    </button>
                    <button className="btn btn-primary ms-1" onClick={() => {setCart([...cart,p])
                      localStorage.setItem('cart', JSON.stringify([...cart, p]))
                      toast.success('Item Added to cart')
                    }}>
                      ADD TO CART <FaCartShopping />
                    </button>
                  </div>
                </div>
              </div>

              
            ))}
          </div>

          <div className="m-2 p-3 text-center">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
