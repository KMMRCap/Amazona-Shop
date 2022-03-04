import { Button, TableCell, TableRow } from '@mui/material';
import React from 'react';
import NextLink from 'next/link'

const AdminOrderRow = ({ order }) => {
    return (
        <TableRow key={order._id}>
            <TableCell>{order._id.substring(20, 24)}</TableCell>
            <TableCell>
                {order.user ? order.user.name : 'DELETED USER'}
            </TableCell>
            <TableCell>{order.createdAt}</TableCell>
            <TableCell>${order.totalPrice}</TableCell>
            <TableCell>
                {order.isPaid
                    ? `paid at ${order.paidAt}`
                    : 'not paid'}
            </TableCell>
            <TableCell>
                {order.isDelivered
                    ? `delivered at ${order.deliveredAt}`
                    : 'not delivered'}
            </TableCell>
            <TableCell>
                <NextLink href={`/order/${order._id}`} passHref>
                    <Button variant="contained">Details</Button>
                </NextLink>
            </TableCell>
        </TableRow>
    );
}

export default AdminOrderRow;