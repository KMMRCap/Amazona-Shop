import React from 'react';
import { TableRow, TableCell, Button } from '@mui/material';
import NextLink from 'next/link';


const AdminUserRow = ({user,onClick}) => {
    return (
        <TableRow key={user._id}>
            <TableCell>{user._id.substring(20, 24)}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.isAdmin ? 'YES' : 'NO'}</TableCell>
            <TableCell>
                <NextLink
                    href={`/admin/user/${user._id}`}
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

export default AdminUserRow;