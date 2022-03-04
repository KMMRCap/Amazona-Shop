import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout'
import { Store } from '../utils/Store';
import { useForm, Controller } from 'react-hook-form'
import useStyles from '../utils/styles';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';

const Shipping = () => {

    const classes = useStyles()

    const { state, dispatch } = useContext(Store)
    const { userInfo, cart: { shippingAddress } } = state

    const router = useRouter()

    useEffect(() => {
        if (!userInfo) {
            router.push('/login?redirect=/shipping')
        }
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('postalCode', shippingAddress.postalCode);
        setValue('country', shippingAddress.country);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { handleSubmit, control, formState: { errors }, setValue } = useForm()

    const submitHandler = async ({ fullName, address, city, postalCode, country }) => {
        const data = { fullName, address, city, postalCode, country }
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: { fullName, address, city, postalCode, country }
        })
        Cookies.set('shippingAddress', JSON.stringify(data))
        router.push('/payment')
    }

    const chooseLocationHandler = () => { }

    return (
        <Layout title="Shipping Address">
            <CheckoutWizard activeStep={1} />
            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                <Typography component="h1" variant="h1">
                    Shipping Address
                </Typography>
                <List>
                    <ListItem>
                        <Controller
                            name="fullName"
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
                                    id="fullName"
                                    label="Full Name"
                                    error={Boolean(errors.fullName)}
                                    helperText={
                                        errors.fullName
                                            ? errors.fullName.type === 'minLength'
                                                ? 'Full Name length is more than 1'
                                                : 'Full Name is required'
                                            : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="address"
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
                                    id="address"
                                    label="Address"
                                    error={Boolean(errors.address)}
                                    helperText={
                                        errors.address
                                            ? errors.address.type === 'minLength'
                                                ? 'Address length is more than 1'
                                                : 'Address is required'
                                            : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="city"
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
                                    id="city"
                                    label="City"
                                    error={Boolean(errors.city)}
                                    helperText={
                                        errors.city
                                            ? errors.city.type === 'minLength'
                                                ? 'City length is more than 1'
                                                : 'City is required'
                                            : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="postalCode"
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
                                    id="postalCode"
                                    label="Postal Code"
                                    error={Boolean(errors.postalCode)}
                                    helperText={
                                        errors.postalCode
                                            ? errors.postalCode.type === 'minLength'
                                                ? 'Postal Code length is more than 1'
                                                : 'Postal Code is required'
                                            : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="country"
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
                                    id="country"
                                    label="Country"
                                    error={Boolean(errors.country)}
                                    helperText={
                                        errors.country
                                            ? errors.country.type === 'minLength'
                                                ? 'Country length is more than 1'
                                                : 'Country is required'
                                            : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Button
                            variant="contained"
                            type="button"
                            onClick={chooseLocationHandler}
                        >
                            Choose on map
                        </Button>
                        <Typography>
                            {/* {location.lat && `${location.lat}, ${location.lat}`} */}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">
                            Continue
                        </Button>
                    </ListItem>
                </List>
            </form>
        </Layout>
    );
}

export default Shipping;