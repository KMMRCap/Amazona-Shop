import React, { useContext } from 'react';
import { Store } from '../utils/Store'
import Layout from '../components/Layout'
import { Button, Card, Grid, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import NextLink from 'next/link'
import dynamic from 'next/dynamic'
import axios from 'axios';
import { useRouter } from 'next/router';
import CartItem from '../components/CartItem';

const CartScreen = () => {

    const { state, dispatch } = useContext(Store)
    const { cart: { cartItems } } = state

    const router = useRouter()

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`)
        if (data.countInStock <= quantity) {
            window.alert('Sorry, Product is out of stock')
            return
        }
        dispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity }
        })
    }

    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    }

    const checkoutHandler = () => {
        router.push('/shipping')
    }

    return (
        <Layout title="Shopping Cart">
            <Typography component="h1" variant="h1">Shopping Cart</Typography>
            {cartItems.length === 0 ? (
                <div>
                    Cart is empty.{' '}
                    <NextLink href="/" passHref>
                        <Link>Go shopping</Link>
                    </NextLink>
                </div>
            ) : (
                <Grid container spacing={1}>
                    <Grid item md={9} xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item, index) => (
                                        <CartItem
                                            key={index}
                                            item={item}
                                            onChange={(e) => updateCartHandler(item, e.target.value)}
                                            onClick={() => removeItemHandler(item)}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Card>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) : $
                                        {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Button
                                        onClick={checkoutHandler}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Check Out
                                    </Button>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });