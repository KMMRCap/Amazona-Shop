import { Button, Card, Grid, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout'
import NextLink from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import useStyles from '../utils/styles';
import axios from 'axios';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { getError } from '../utils/getError'

const Profile = () => {

    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;

    const { handleSubmit, control, formState: { errors }, setValue, } = useForm();

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const router = useRouter();

    const classes = useStyles();

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login');
        }
        setValue('name', userInfo.name);
        setValue('email', userInfo.email);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler = async ({ name, email, password, confirmPassword }) => {
        closeSnackbar();
        if (password !== confirmPassword) {
            enqueueSnackbar("Passwords don't match", { variant: 'error' });
            return;
        }
        try {
            const { data } = await axios.put('/api/users/profile', { name, email, password }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch({ type: 'USER_LOGIN', payload: data });
            Cookies.set('userInfo', data);
            enqueueSnackbar('Profile updated successfully', { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' })
        }
    };

    return (
        <Layout title="Profile">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink href="/profile" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="User Profile" />
                                </ListItem>
                            </NextLink>
                            <NextLink href="/order-history" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Order History" />
                                </ListItem>
                            </NextLink>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h1" variant="h1">Profile</Typography>
                            </ListItem>
                            <ListItem>
                                <form onSubmit={handleSubmit(submitHandler)} className={classes.form} >
                                    <List>
                                        <ListItem>
                                            <Controller
                                                name="name"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                    minLength: 2,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="name"
                                                        label="Name"
                                                        inputProps={{ type: 'name' }}
                                                        error={Boolean(errors.name)}
                                                        helperText={
                                                            errors.name ?
                                                                errors.name.type === 'minLength' ?
                                                                    'Name length is more than 1'
                                                                    :
                                                                    'Name is required'
                                                                :
                                                                ''
                                                        }
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="email"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="email"
                                                        label="Email"
                                                        inputProps={{ type: 'email' }}
                                                        error={Boolean(errors.email)}
                                                        helperText={
                                                            errors.email ?
                                                                errors.email.type === 'pattern' ?
                                                                    'Email is not valid'
                                                                    :
                                                                    'Email is required'
                                                                :
                                                                ''
                                                        }
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="password"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    validate: (value) =>
                                                        value === '' ||
                                                        value.length > 5 ||
                                                        'Password length is more than 5',
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="password"
                                                        label="Password"
                                                        inputProps={{ type: 'password' }}
                                                        error={Boolean(errors.password)}
                                                        helperText={
                                                            errors.password ?
                                                                'Password length is more than 5'
                                                                :
                                                                ''
                                                        }
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="confirmPassword"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    validate: (value) =>
                                                        value === '' ||
                                                        value.length > 5 ||
                                                        'Confirm Password length is more than 5',
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="confirmPassword"
                                                        label="Confirm Password"
                                                        inputProps={{ type: 'password' }}
                                                        error={Boolean(errors.confirmPassword)}
                                                        helperText={
                                                            errors.password
                                                                ? 'Confirm Password length is more than 5'
                                                                : ''
                                                        }
                                                        {...field}
                                                    />
                                                )}
                                            />
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

export default dynamic(() => Promise.resolve(Profile), { ssr: false });