import { Button, Card, CircularProgress, Grid, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../components/Layout'
import NextLink from 'next/link'
import useStyles from '../../utils/styles';
import { useRouter } from 'next/router';
import { Store } from '../../utils/Store';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { reducer } from '../../utils/reducerFunctions'
import { usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Paypal from '../../components/Paypal';
import { getError } from '../../utils/getError'


export async function getServerSideProps({ params }) {
    return { props: { params } };
}

const Order = ({ params }) => {

    const orderId = params.id

    const classes = useStyles()

    const router = useRouter();

    const { state } = useContext(Store);
    const { userInfo } = state

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const [{ loading, error, order, successPay, loadingDeliver, successDeliver }, dispatch] = useReducer(
        reducer, {
        loading: true,
        order: {},
        error: '',
    });

    const { shippingAddress, paymentMethod, orderItems, itemsPrice, taxPrice,
        shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt } = order

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login')
        }
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }
        if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' });
            }
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' });
            }
        }
        else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                paypalDispatch({
                    type: 'resetOptions', value: {
                        'client-id': clientId,
                        currency: 'USD',
                    }
                })
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            };
            loadPaypalScript();
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order, successPay, successDeliver])

    const deliverOrderHandler = async () => {
        try {
            dispatch({ type: 'DELIVER_REQUEST' });
            const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {}, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch({ type: 'DELIVER_SUCCESS', payload: data });
            enqueueSnackbar('Order is delivered', { variant: 'success' });
        }
        catch (err) {
            dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    }

    return (
        <Layout title={`Order ${orderId}`}>
            <Typography component="h1" variant="h1">
                Order {orderId}
            </Typography>
            {loading ?
                <CircularProgress />
                :
                error ?
                    <Typography className={classes.error}>{error}</Typography>
                    :
                    <Grid container spacing={1}>
                        <Grid item md={9} xs={12}>
                            <Card className={classes.section}>
                                <List>
                                    <ListItem>
                                        <Typography component="h2" variant="h2">
                                            Shipping Address
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        {shippingAddress.fullName}, {shippingAddress.address},{' '}
                                        {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                                        {shippingAddress.country}
                                        &nbsp;
                                        {shippingAddress.location && (
                                            <Link
                                                variant="button"
                                                target="_new"
                                                href={`https://maps.google.com?q=${shippingAddress.location.lat},${shippingAddress.location.lng}`}
                                            >
                                                Show On Map
                                            </Link>
                                        )}
                                    </ListItem>
                                    <ListItem>
                                        Status:{' '}
                                        {isDelivered ? `delivered at ${deliveredAt}` : 'not delivered'}
                                    </ListItem>
                                </List>
                            </Card>
                            <Card className={classes.section}>
                                <List>
                                    <ListItem>
                                        <Typography component="h2" variant="h2">
                                            Payment Method
                                        </Typography>
                                    </ListItem>
                                    <ListItem>{paymentMethod}</ListItem>
                                    <ListItem>
                                        Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
                                    </ListItem>
                                </List>
                            </Card>
                            <Card className={classes.section}>
                                <List>
                                    <ListItem>
                                        <Typography component="h2" variant="h2">
                                            Order Items
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Image</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell align="right">Quantity</TableCell>
                                                        <TableCell align="right">Price</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {orderItems.map((item) => (
                                                        <TableRow key={item._id}>
                                                            <TableCell>
                                                                <NextLink href={`/product/${item.slug}`} passHref>
                                                                    <Link>
                                                                        <Image
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            width={50}
                                                                            height={50}
                                                                        />
                                                                    </Link>
                                                                </NextLink>
                                                            </TableCell>
                                                            <TableCell>
                                                                <NextLink href={`/product/${item.slug}`} passHref>
                                                                    <Link>
                                                                        <Typography>{item.name}</Typography>
                                                                    </Link>
                                                                </NextLink>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography>{item.quantity}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography>${item.price}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </ListItem>
                                </List>
                            </Card>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <Card className={classes.section}>
                                <List>
                                    <ListItem>
                                        <Typography variant="h2">Order Summary</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Items:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align="right">${itemsPrice}</Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Tax:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align="right">${taxPrice}</Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Shipping:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align="right">${shippingPrice}</Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>
                                                    <strong>Total:</strong>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align="right">
                                                    <strong>${totalPrice}</strong>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    {!isPaid && (
                                        <ListItem>
                                            {isPending ?
                                                <CircularProgress />
                                                :
                                                <div className={classes.fullWidth}>
                                                    <Paypal
                                                        dispatch={dispatch}
                                                        order={order}
                                                        totalPrice={totalPrice}
                                                        userInfo={userInfo}
                                                    />
                                                </div>
                                            }
                                        </ListItem>
                                    )}
                                    {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                        <ListItem>
                                            {loadingDeliver && <CircularProgress />}
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                onClick={deliverOrderHandler}
                                            >
                                                Deliver Order
                                            </Button>
                                        </ListItem>
                                    )}
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
            }
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });