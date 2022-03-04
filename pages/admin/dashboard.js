import { Button, Card, CardActions, CardContent, CircularProgress, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import NextLink from 'next/link'
import useStyles from '../../utils/styles';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import axios from 'axios';
import { dashboardReducer } from '../../utils/reducerFunctions'
import { Bar } from 'react-chartjs-2'
import dynamic from 'next/dynamic';
import { getError } from '../../utils/getError'

const AdminDashboard = () => {

    const classes = useStyles()

    const { state } = useContext(Store);
    const { userInfo } = state;

    const router = useRouter();

    const [{ loading, error, summary }, dispatch] = useReducer(dashboardReducer, {
        loading: true,
        summary: { salesData: [] },
        error: '',
    });

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/summary`, {
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
        <Layout title="Admin Dashboard">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink href="/admin/dashboard" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Admin Dashboard" />
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/orders" passHref>
                                <ListItem button component="a">
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
                                {loading ?
                                    <CircularProgress />
                                    :
                                    error ?
                                        <Typography className={classes.error}>{error}</Typography>
                                        :
                                        <Grid container spacing={5}>
                                            <Grid item md={3}>
                                                <Card raised>
                                                    <CardContent>
                                                        <Typography variant="h1">
                                                            ${summary.ordersPrice}
                                                        </Typography>
                                                        <Typography>Sales</Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <NextLink href="/admin/orders" passHref>
                                                            <Button size="small" color="primary">
                                                                View sales
                                                            </Button>
                                                        </NextLink>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                            <Grid item md={3}>
                                                <Card raised>
                                                    <CardContent>
                                                        <Typography variant="h1">
                                                            {summary.ordersCount}
                                                        </Typography>
                                                        <Typography>Orders</Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <NextLink href="/admin/orders" passHref>
                                                            <Button size="small" color="primary">
                                                                View orders
                                                            </Button>
                                                        </NextLink>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                            <Grid item md={3}>
                                                <Card raised>
                                                    <CardContent>
                                                        <Typography variant="h1">
                                                            {summary.productsCount}
                                                        </Typography>
                                                        <Typography>Products</Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <NextLink href="/admin/products" passHref>
                                                            <Button size="small" color="primary">
                                                                View products
                                                            </Button>
                                                        </NextLink>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                            <Grid item md={3}>
                                                <Card raised>
                                                    <CardContent>
                                                        <Typography variant="h1">
                                                            {summary.usersCount}
                                                        </Typography>
                                                        <Typography>Users</Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <NextLink href="/admin/users" passHref>
                                                            <Button size="small" color="primary">
                                                                View users
                                                            </Button>
                                                        </NextLink>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                }
                            </ListItem>
                            <ListItem>
                                <Typography component="h1" variant="h1">
                                    Sales Chart
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Bar
                                    data={{
                                        labels: summary.salesData.map((x) => x._id),
                                        datasets: [
                                            {
                                                label: 'Sales',
                                                backgroundColor: 'rgba(162, 222, 208, 1)',
                                                data: summary.salesData.map((x) => x.totalSales),
                                            },
                                        ],
                                    }}
                                    options={{
                                        legend: { display: true, position: 'right' },
                                    }}
                                />
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });