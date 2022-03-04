import { Button, Card, CircularProgress, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import NextLink from 'next/link'
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import useStyles from '../../utils/styles';
import { adminOrdersReducer } from '../../utils/reducerFunctions';
import axios from 'axios';
import AdminOrderRow from '../../components/AdminOrderRow';
import { getError } from '../../utils/getError'

const AdminOrders = () => {

    const { state } = useContext(Store);
    const { userInfo } = state;

    const router = useRouter();

    const classes = useStyles();

    const [{ loading, error, orders }, dispatch] = useReducer(adminOrdersReducer, {
        loading: true,
        orders: [],
        error: '',
    });

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/orders`, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout title="Orders">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink href="/admin/dashboard" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Admin Dashboard" />
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/orders" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Orders" />
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/products" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Products" />
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/users" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Users" />
                                </ListItem>
                            </NextLink>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h1" variant="h1">Orders</Typography>
                            </ListItem>
                            <ListItem>
                                {loading ?
                                    <CircularProgress />
                                    :
                                    error ?
                                        <Typography className={classes.error}>{error}</Typography>
                                        :
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ID</TableCell>
                                                        <TableCell>USER</TableCell>
                                                        <TableCell>DATE</TableCell>
                                                        <TableCell>TOTAL</TableCell>
                                                        <TableCell>PAID</TableCell>
                                                        <TableCell>DELIVERED</TableCell>
                                                        <TableCell>ACTION</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {orders.map((order, index) => (
                                                        <AdminOrderRow
                                                            key={index}
                                                            order={order}
                                                        />
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                }
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });