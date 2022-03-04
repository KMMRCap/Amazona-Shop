import React from 'react';
import { Button, Link, MenuItem, Select, TableCell, TableRow, Typography } from '@mui/material';
import NextLink from 'next/link'
import Image from 'next/image';

const CartItem = ({ item, onChange, onClick }) => {
    return (
        <TableRow key={item._id}>
            <TableCell>
                <NextLink href={`/product/${item.slug}`} passHref>
                    <Link>
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                        />
                    </Link>
                </NextLink>
            </TableCell>
            <TableCell>
                <NextLink href={`/product/${item.slug}`} passHref>
                    <Link>
                        <Typography>{item.name}</Typography>
                    </Link>
                </NextLink>
            </TableCell>
            <TableCell align="right">
                <Select value={item.quantity} onChange={onChange}>
                    {[...Array(item.countInStock).keys()].map((x) => (
                        <MenuItem key={x + 1} value={x + 1}>
                            {x + 1}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell align="right">${item.price}</TableCell>
            <TableCell align="right">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={onClick}
                >
                    x
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default CartItem;