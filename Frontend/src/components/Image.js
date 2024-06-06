import axios from 'axios'
import React from 'react'

async function Image({id, name}) {
    let imgSrc = await axios.get(`/api/v1/product/product-photo/${id}`)
  return (
    <img src={`data:image/jpg;base64,${imgSrc}`} className="card-img-top" alt={name} />
  )
}

export default Image;