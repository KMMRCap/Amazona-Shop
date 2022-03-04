import { Button, TableCell, TableRow } from '@mui/material';
import React from 'react';
import NextLink from 'next/link'

const AdminProductRow = ({ product, onClick }) => {
    return (
        <TableRow key={product._id}>
            <TableCell>
                {product._id.substring(20, 24)}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.countInStock}</TableCell>
            <TableCell>{product.rating}</TableCell>
            <TableCell>
                <NextLink
                    href={`/admin/product/${product._id}`}
                    passHref
                >
                    <Button size="small" variant="contained">
                        Edit
                    </Button>
                </NextLink>{' '}
                <Button
                    onClick={onClick}
                    size="small"
                    variant="contained"
                >
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default AdminProductRow;