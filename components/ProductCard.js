import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Rating, Typography } from '@mui/material';
import React from 'react';
import NextLink from 'next/link'

const ProductCard = ({ product, onClick }) => {
    return (
        <Grid item md={4} key={product.name}>
            <Card>
                <NextLink passHref href={`/product/${product.slug}`}>
                    <CardActionArea>
                        <CardMedia component='img' image={product.image} title={product.name} />
                        <CardContent>
                            <Typography>{product.name}</Typography>
                            <Rating value={product.rating} readOnly />
                        </CardContent>
                    </CardActionArea>
                </NextLink>
                <CardActions>
                    <Typography>${product.price}</Typography>
                    <Button size='small' color='primary' onClick={onClick}>
                        ADD TO CART
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}

export default ProductCard;