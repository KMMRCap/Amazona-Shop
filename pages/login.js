import { Button, Link, List, ListItem, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout'
import NextLink from 'next/link'
import useStyles from '../utils/styles';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useForm, Controller } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { getError } from '../utils/getError'

const Login = () => {

    const classes = useStyles()

    const { state, dispatch } = useContext(Store)
    const { userInfo } = state

    const router = useRouter()
    const { redirect } = router.query

    useEffect(() => {
        if (userInfo) {
            router.push('/')
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { handleSubmit, control, formState: { errors } } = useForm()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const submitHandler = async ({ email, password }) => {
        closeSnackbar()
        try {
            const { data } = await axios.post('/api/users/login', { email, password })
            dispatch({ type: 'USER_LOGIN', payload: data })
            Cookies.set('userInfo', JSON.stringify(data))
            router.push(redirect || '/')
        }
        catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' })
        }
    }

    return (
        <Layout title="Login">
            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                <Typography component="h1" variant="h1">
                    Login
                </Typography>
                <List>
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
                                    helperText={errors.email ?
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
                                required: true,
                                minLength: 6,
                            }}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    inputProps={{ type: 'password' }}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password ?
                                        errors.password.type === 'minLength' ?
                                            'Password length is more than 5'
                                            :
                                            'Password is required'
                                        :
                                        ''
                                    }
                                    {...field}
                                />
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">
                            Login
                        </Button>
                    </ListItem>
                    <ListItem>
                        Don&apos;t have an account? &nbsp;
                        <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
                            <Link>Register</Link>
                        </NextLink>
                    </ListItem>
                </List>
            </form>
        </Layout>
    );
}

export default Login;