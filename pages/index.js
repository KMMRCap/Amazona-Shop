/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { Grid, Link, Typography } from "@mui/material";
import Layout from "../components/Layout";
import db from '../utils/db'
import Product from '../models/Product'
import axios from "axios";
import { useContext } from "react";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import ProductCard from "../components/ProductCard";
import Carousel from 'react-material-ui-carousel'
import useStyles from "../utils/styles";
import NextLink from 'next/link'

export const getServerSideProps = async () => {
  await db.connect();
  const featuredProductsDocs = await Product.find({ isFeatured: true }, '-reviews').lean().limit(3);
  const topRatedProductsDocs = await Product.find({}, '-reviews').lean().sort({ rating: -1 }).limit(6);
  await db.disconnect();
  return {
    props: {
      featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
}

export default function Home({ featuredProducts, topRatedProducts }) {

  const { state, dispatch } = useContext(Store)
  const { cart: { cartItems } } = state

  const router = useRouter()

  const classes = useStyles()

  const addToCartHandler = async (product) => {
    const existItem = cartItems.find(x => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock')
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    router.push('/cart')
  }

  return (
    <Layout>
      <Carousel className={classes.mt1} animation="slide">
        {featuredProducts.map((product, index) => (
          <NextLink key={index} href={`/product/${product.slug}`} passHref>
            <Link>
              <img
                src={product.featuredImage}
                alt={product.name}
              />
            </Link>
          </NextLink>
        ))}
      </Carousel>
      <Typography component='h1' variant='h1'>Popular Products</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product, index) => (
          <ProductCard key={index} product={product} onClick={() => addToCartHandler(product)} />
        ))}
      </Grid>
    </Layout>
  )
}
