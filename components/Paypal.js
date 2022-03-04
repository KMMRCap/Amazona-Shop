import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js'
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/getError'

const Paypal = ({ dispatch, order, totalPrice, userInfo }) => {

    const { enqueueSnackbar } = useSnackbar();

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: { value: totalPrice },
            }]
        }).then((orderID) => {
            return orderID;
        });
    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await axios.put(`/api/orders/${order._id}/pay`, details, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    },
                }
                );
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                enqueueSnackbar('Order is paid', { variant: 'success' });
            } catch (err) {
                dispatch({ type: 'PAY_FAIL', payload: getError(err) });
                enqueueSnackbar(getError(err), { variant: 'error' });
            }
        });
    }

    function onError(err) {
        enqueueSnackbar('onError Function caught this error', { variant: 'error' })
        console.log(err);
    }

    return (
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
        />
    );
}

export default Paypal;