import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import useFetchProducts from './Contexts/Products';
const FetchProducts = () => {

    const [cart, setCart] = useState([]);
    const { products, addToCart } = useFetchProducts();



    useEffect(() => { console.log(products) }, [])

    return (
        <div>
            <h1>Products</h1>
            <div className="w-full grid grid-cols-2 pt-20 gap-5">
                {/* {products.map((product) => (
                    <div className="flex flex-col items-center gap-4" key={product.node.id}>
                        <img src={product.node.featuredImage.url} alt="" className="w-[150px] h-[200px] rounded border" />
                        <h3 className='font-bold'>Title: {product.node.title}</h3>
                        <h4>Price: {product.node.priceRange.maxVariantPrice.currencyCode} {product.node.priceRange.maxVariantPrice.amount}</h4>
                        <h5>In Stock: {product.node.variants.edges[0].node.quantityAvailable > 0 ? 'Yes' : 'No'}</h5>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => addToCart(product.node.variants.edges[0].node.id)}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))} */}
                {products.map((product) => (
                    <div className="flex flex-col items-center gap-4" key={product.node.id}>
                        <img src={product.node.featuredImage.url} alt="" className="w-[150px] h-[200px] rounded border" />
                        <h3 className="font-bold">Title: {product.node.title}</h3>
                        <h4>Price: {product.node.priceRange.maxVariantPrice.currencyCode} {product.node.priceRange.maxVariantPrice.amount}</h4>
                        <h5>In Stock: {product.node.variants.edges[0].node.quantityAvailable > 0 ? 'Yes' : 'No'}</h5>
                        <select
                            className="px-4 py-2 bg-gray-200 rounded"
                            onChange={(e) => addToCart(e.target.value)}
                        >
                            <option value="">Select a variant</option>
                            {product.node.variants.edges.map(({ node: variant }) => (
                                <option key={variant.id} value={variant.id}>
                                    {variant.selectedOptions.map(({ name, value }) => `${name}: ${value}`).join(', ')}
                                </option>
                            ))}
                        </select>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => addToCart(cart.filter(i => i.variant.id !== item.variant.id))}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <div>
                    <h2>Cart</h2>
                    <ul>
                        {cart.map(item => (
                            <li key={item.variantId}>Variant ID: {item.variantId}, Quantity: {item.quantity}</li>
                        ))}
                    </ul>
                    <button onClick={createCheckout} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
}

export default FetchProducts;
