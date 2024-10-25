import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const useFetchProducts = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const client = new ApolloClient({
        uri: 'https://9d851f.myshopify.com/api/2023-07/graphql.json',
        headers: {
            'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_APP_STOREFRONT_KEY,
            'Content-Type': 'application/json',
        },
        cache: new InMemoryCache(),
    });

    const GET_PRODUCTS = gql`
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            featuredImage {
              url
            }
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  quantityAvailable
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              id
              name
              values
            }
          }
        }
      }
    }
  `;

    useEffect(() => {
        client.query({ query: GET_PRODUCTS })
            .then(result => {
                console.log('Products are as follows, ', result.data.products.edges);
                setProducts(result.data.products.edges);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const addToCart = (variantId) => {
        const existingItem = cart.find(item => item.variantId === variantId);

        if (existingItem) {
            setCart(cart.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { variantId, quantity: 1 }]);
        }
    };


    const CREATE_CHECKOUT = gql`
    mutation checkoutCreate($lineItems: [CheckoutLineItemInput!]!) {
      checkoutCreate(input: { lineItems: $lineItems }) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

    const createCheckout = async () => {
        const lineItems = cart.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
        }));

        try {
            const result = await client.mutate({
                mutation: CREATE_CHECKOUT,
                variables: {
                    lineItems: lineItems,
                },
            });

            if (result.data.checkoutCreate.checkout) {
                window.location.href = result.data.checkoutCreate.checkout.webUrl;
            } else {
                console.error('Checkout creation failed:', result.data.checkoutCreate.checkoutUserErrors);
            }
        } catch (error) {
            console.error("Error creating checkout:", error);
        }
    };
    useEffect(() => {
        console.log('Cart contents are as folows ', cart)
    }, [cart])
    return { products, addToCart, cart, createCheckout };
};

export default useFetchProducts;