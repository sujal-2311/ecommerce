import React from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/search'
import { MdReadMore } from 'react-icons/md'
import { FaCartShopping } from 'react-icons/fa6'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";

const Search = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart()
    const [values,setValues] = useSearch()
    console.log('Search results:', values.results);

    function handleRedirect(id) {
      navigate(`/product/${id}`);
    }

  return (
    <Layout>
        <div className='container'>
            <div className='text-center'>
                <h1>Search Results</h1>
                <h6>{values.results?.products.length < 0 ? 'No Products Found' : `Found ${values.results.products.length}`}</h6>
                <div className="d-flex flex-wrap mt-4">
            {values?.results.products.map((p) => (
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
            </div>
        </div>
    </Layout>
  )
}

export default Search;