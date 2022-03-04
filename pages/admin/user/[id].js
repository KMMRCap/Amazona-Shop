import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import { Grid, List, ListItem, Typography, Card, Button, ListItemText, TextField, CircularProgress, Checkbox, FormControlLabel, } from '@mui/material';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { adminUserReducer } from '../../../utils/reducerFunctions'
import { getError } from '../../../utils/getError'


export async function getServerSideProps({ params }) {
    return {
        props: { params },
    };
}


const AdminUser = ({ params }) => {

    const userId = params.id;

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(adminUserReducer, {
        loading: true,
        error: '',
    });

    const { handleSubmit, control, formState: { errors }, setValue, } = useForm();

    const [isAdmin, setIsAdmin] = useState(false);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const router = useRouter();

    const classes = useStyles();

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login');
        } else {
            const fetchData = async () => {
                try {
                    dispatch({ type: 'FETCH_REQUEST' });
                    const { data } = await axios.get(`/api/admin/users/${userId}`, {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                    });
                    setIsAdmin(data.isAdmin);
                    dispatch({ type: 'FETCH_SUCCESS' });
                    setValue('name', data.name);
                } catch (err) {
                    dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
                }
            };
            fetchData();
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler = async ({ name }) => {
        closeSnackbar();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(`/api/admin/users/${userId}`, { name, isAdmin }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            });
            dispatch({ type: 'UPDATE_SUCCESS' });
            enqueueSnackbar('User updated successfully', { variant: 'success' });
            router.push('/admin/users');
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    return (
        <Layout title={`Edit User ${userId}`}>
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink href="/admin/dashboard" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Admin Dashboard"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/orders" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Orders"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/products" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Products"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/users" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Users"></ListItemText>
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
                                    Edit User {userId}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                {loading && <CircularProgress></CircularProgress>}
                                {error && (
                                    <Typography className={classes.error}>{error}</Typography>
                                )}
                            </ListItem>
                            <ListItem>
                                <form
                                    onSubmit={handleSubmit(submitHandler)}
                                    className={classes.form}
                                >
                                    <List>
                                        <ListItem>
                                            <Controller
                                                name="name"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="name"
                                                        label="Name"
                                                        error={Boolean(errors.name)}
                                                        helperText={errors.name ? 'Name is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <FormControlLabel
                                                label="Is Admin"
                                                control={
                                                    <Checkbox
                                                        onClick={(e) => setIsAdmin(e.target.checked)}
                                                        checked={isAdmin}
                                                        name="isAdmin"
                                                    />
                                                }
                                            ></FormControlLabel>
                                        </ListItem>
                                        <ListItem>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                fullWidth
                                                color="primary"
                                            >
                                                Update
                                            </Button>
                                            {loadingUpdate && <CircularProgress />}
                                        </ListItem>
                                    </List>
                                </form>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdminUser), { ssr: false });