import { Button, Card, CircularProgress, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../components/Layout'
import NextLink from 'next/link'
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import useStyles from '../../utils/styles';
import { adminProductsReducer } from '../../utils/reducerFunctions'
import axios from 'axios';
import { useSnackbar } from 'notistack';
import dynamic from 'next/dynamic';
import AdminProductRow from '../../components/AdminProductRow';
import { getError } from '../../utils/getError'

const AdminProducts = () => {

    const { state } = useContext(Store);
    const { userInfo } = state;

    const router = useRouter();

    const classes = useStyles();

    const [{ loading, error, products, loadingCreate, successDelete, loadingDelete }, dispatch] = useReducer(
        adminProductsReducer, {
        loading: true,
        products: [],
        error: '',
    });

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/products`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successDelete]);

    const createHandler = async () => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            const { data } = await axios.post(`/api/admin/products`, {}, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            });
            dispatch({ type: 'CREATE_SUCCESS' });
            enqueueSnackbar('Product created successfully', { variant: 'success' });
            router.push(`/admin/product/${data.product._id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };
    const deleteHandler = async (productId) => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`/api/admin/products/${productId}`, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch({ type: 'DELETE_SUCCESS' });
            enqueueSnackbar('Product deleted successfully', { variant: 'success' });
        } catch (err) {
            dispatch({ type: 'DELETE_FAIL' });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    return (
        <Layout title="Products">
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
                                <ListItem button component="a">
                                    <ListItemText primary="Orders" />
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/products" passHref>
                                <ListItem selected button component="a">
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
                                <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                        <Typography component="h1" variant="h1">
                                            Products
                                        </Typography>
                                        {loadingDelete && <CircularProgress />}
                                    </Grid>
                                    <Grid align="right" item xs={6}>
                                        <Button
                                            onClick={createHandler}
                                            color="primary"
                                            variant="contained"
                                        >
                                            Create
                                        </Button>
                                        {loadingCreate && <CircularProgress />}
                                    </Grid>
                                </Grid>
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
                                                        <TableCell>NAME</TableCell>
                                                        <TableCell>PRICE</TableCell>
                                                        <TableCell>CATEGORY</TableCell>
                                                        <TableCell>COUNT</TableCell>
                                                        <TableCell>RATING</TableCell>
                                                        <TableCell>ACTIONS</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {products.map((product, index) => (
                                                        <AdminProductRow
                                                            key={index}
                                                            product={product}
                                                            onClick={() => deleteHandler(product._id)}
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

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });