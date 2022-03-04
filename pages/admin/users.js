import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import { CircularProgress, Grid, List, ListItem, Typography, Card, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import { useSnackbar } from 'notistack';
import { adminUsersReducer } from '../../utils/reducerFunctions'
import AdminUserRow from '../../components/AdminUserRow';
import { getError } from '../../utils/getError'

const AdminUsers = () => {

    const { state } = useContext(Store);
    const { userInfo } = state;

    const router = useRouter();

    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();

    const [{ loading, error, users, successDelete, loadingDelete }, dispatch] = useReducer(adminUsersReducer, {
        loading: true,
        users: [],
        error: '',
    });

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/users`, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }
            catch (err) {
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

    const deleteHandler = async (userId) => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`/api/admin/users/${userId}`, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                },
            });
            dispatch({ type: 'DELETE_SUCCESS' });
            enqueueSnackbar('User deleted successfully', { variant: 'success' });
        } catch (err) {
            dispatch({ type: 'DELETE_FAIL' });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    return (
        <Layout title="Users">
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
                                <ListItem button component="a">
                                    <ListItemText primary="Products" />
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/users" passHref>
                                <ListItem selected button component="a">
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
                                <Typography component="h1" variant="h1">
                                    Users
                                </Typography>
                                {loadingDelete && <CircularProgress />}
                            </ListItem>

                            <ListItem>
                                {loading ? (
                                    <CircularProgress />
                                ) : error ? (
                                    <Typography className={classes.error}>{error}</Typography>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>NAME</TableCell>
                                                    <TableCell>EMAIL</TableCell>
                                                    <TableCell>ISADMIN</TableCell>
                                                    <TableCell>ACTIONS</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {users.map((user, index) => (
                                                    <AdminUserRow
                                                        key={index}
                                                        user={user}
                                                        onClick={() => deleteHandler(user._id)}
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });