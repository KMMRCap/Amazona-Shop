import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout'
import NextLink from 'next/link'
import { Box, Button, Card, CircularProgress, Grid, Link, List, ListItem, Rating, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import useStyles from '../../utils/styles';
import db from '../../utils/db'
import Product from '../../models/Product';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/getError';

export const getServerSideProps = async (context) => {
    const { params } = context
    const { slug } = params

    await db.connect()
    const product = await Product.findOne({ slug }, '-reviews').lean();
    await db.disconnect()

    return {
        props: {
            product: db.convertDocToObj(product)
        }
    }
}

const ProductScreen = (props) => {

    const { product } = props

    const classes = useStyles()

    const { state, dispatch } = useContext(Store)
    const { userInfo } = state

    const router = useRouter()

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (rating === 0 && !comment) {
            return
        }
        setLoading(true);
        try {
            await axios.post(`/api/products/${product._id}/reviews`, { rating, comment }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            setLoading(false);
            enqueueSnackbar('Review submitted successfully', { variant: 'success' });
            fetchReviews();
        } catch (err) {
            setLoading(false);
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/products/${product._id}/reviews`);
            setReviews(data);
        } catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    useEffect(() => {
        fetchReviews();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!product) {
        return <div>Product Not Found</div>
    }

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find(x => x._id === product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`/api/products/${product._id}`)
        if (data.countInStock < quantity) {
            window.alert('Sorry, Product is out of stock')
            return
        }
        dispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity }
        })
        router.push('/cart')
    }

    return (
        <Layout title={product.name} description={product.description}>
            <Box className={classes.section}>
                <NextLink href="/" passHref>
                    <Link>
                        <Typography>back to products</Typography>
                    </Link>
                </NextLink>
            </Box>
            <Grid container spacing={1}>
                <Grid item md={6} xs={12}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={640}
                        height={640}
                        layout="responsive"
                    ></Image>
                </Grid>
                <Grid item md={3} xs={12}>
                    <List>
                        <ListItem>
                            <Typography component="h1" variant="h3">
                                {product.name}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Category: {product.category}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Brand: {product.brand}</Typography>
                        </ListItem>
                        <ListItem>
                            <Rating value={product.rating} readOnly />
                            <Link href="#reviews">
                                <Typography>({product.numReviews} reviews)</Typography>
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Typography> Description: {product.description}</Typography>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Price</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>${product.price}</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Status</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>
                                            {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={addToCartHandler}
                                >
                                    Add to cart
                                </Button>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
            <List>
                <ListItem>
                    <Typography name="reviews" id="reviews" variant="h2">
                        Customer Reviews
                    </Typography>
                </ListItem>
                {reviews.length === 0 && <ListItem>No review</ListItem>}
                {reviews.map((review) => (
                    <ListItem key={review._id}>
                        <Grid container>
                            <Grid item className={classes.reviewItem}>
                                <Typography>
                                    <strong>{review.name}</strong>
                                </Typography>
                                <Typography>{review.createdAt.substring(0, 10)}</Typography>
                            </Grid>
                            <Grid item>
                                <Rating value={review.rating} readOnly />
                                <Typography>{review.comment}</Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
                <ListItem>
                    {userInfo ? (
                        <form onSubmit={submitHandler} className={classes.reviewForm}>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">Leave your review</Typography>
                                </ListItem>
                                <ListItem>
                                    <TextField
                                        multiline
                                        variant="outlined"
                                        fullWidth
                                        name="review"
                                        label="Enter comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Rating
                                        name="simple-controlled"
                                        value={parseInt(rating)}
                                        onChange={(e) => setRating(e.target.value)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                    >
                                        Submit
                                    </Button>

                                    {loading && <CircularProgress />}
                                </ListItem>
                            </List>
                        </form>
                    ) : (
                        <Typography variant="h2">
                            Please{' '}
                            <Link href={`/login?redirect=/product/${product.slug}`}>
                                login
                            </Link>{' '}
                            to write a review
                        </Typography>
                    )}
                </ListItem>
            </List>
        </Layout>
    );
}

export default ProductScreen;