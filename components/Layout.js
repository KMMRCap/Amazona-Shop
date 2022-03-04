import { AppBar, Badge, Box, Button, ClickAwayListener, Container, createTheme, CssBaseline, Divider, Drawer, Grow, IconButton, InputBase, Link, List, ListItem, ListItemText, Menu, MenuItem, MenuList, Paper, Popper, Switch, ThemeProvider, Toolbar, Typography } from '@mui/material'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState, useRef, useEffect } from 'react'
import useStyles from '../utils/styles'
import { Store } from '../utils/Store'
import Cookies from 'js-cookie'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'
import { getError } from '../utils/getError'
import { useSnackbar } from 'notistack';
import axios from 'axios'

export default function Layout({ title, description, children }) {

    const { state, dispatch } = useContext(Store)
    const { cart, darkMode, userInfo } = state

    const theme = createTheme({
        typography: {
            h1: {
                fontSize: '1.6rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            h2: {
                fontSize: '1.4rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
        },
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#f0c000',
            },
            secondary: {
                main: '#208080',
            },
        },
    });

    const [open, setOpen] = useState(false);
    const [sidbarVisible, setSidebarVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState('');

    const anchorRef = useRef(null);
    const prevOpen = useRef(open);

    const classes = useStyles()

    const router = useRouter()

    const { enqueueSnackbar } = useSnackbar();

    const handleDarkMode = () => {
        dispatch({ type: 'Dark_Mode' })
        const newDarkMode = !darkMode
        Cookies.set('darkMode', newDarkMode ? 'On' : 'Off')
    }

    const handleRoute = (redirect) => {
        if (redirect) {
            router.push(redirect)
            setOpen(false);
        }
    }

    const logoutClickHandler = () => {
        dispatch({ type: 'USER_LOGOUT' });
        Cookies.remove('userInfo');
        Cookies.remove('cartItems');
        Cookies.remove('shippinhAddress');
        Cookies.remove('paymentMethod');
        router.push('/');
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`/api/products/categories`);
            setCategories(data);
        } catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        router.push(`/search?query=${query}`);
    };

    useEffect(() => {
        fetchCategories();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);


    return (
        <div>
            <Head>
                <title>{title ? title + ' - Next Amazona' : 'Next Amazona'}</title>
                {description && <meta name='description' content={description} />}
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position='static' className={classes.navbar}>
                    <Toolbar className='navbar-toolbar'>
                        <Box display="flex" alignItems="center">
                            <IconButton
                                edge="start"
                                aria-label="open drawer"
                                onClick={() => setSidebarVisible(true)}
                                className={classes.menuButton}
                            >
                                <MenuIcon className={classes.navbarButton} />
                            </IconButton>
                            <NextLink href="/" passHref>
                                <Link>
                                    <Typography className={classes.brand}>amazona</Typography>
                                </Link>
                            </NextLink>
                        </Box>
                        <Drawer
                            anchor="left"
                            open={sidbarVisible}
                            onClose={() => setSidebarVisible(false)}
                        >
                            <List>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="flex-end"
                                >
                                    <IconButton
                                        aria-label="close"
                                        onClick={() => setSidebarVisible(false)}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Box>
                                <NextLink
                                    href='/search?sort=featured'
                                    passHref
                                >
                                    <ListItem
                                        button
                                        component="a"
                                        onClick={() => setSidebarVisible(false)}
                                    >
                                        <ListItemText primary='All Products' />
                                    </ListItem>
                                </NextLink>
                                <Divider light sx={{ marginBottom: '1rem' }} />
                                <ListItem>
                                    <Typography sx={{ fontSize: '12px' }}>Shopping by category</Typography>
                                </ListItem>
                                <Divider light />
                                {categories.map((category) => (
                                    <NextLink
                                        key={category}
                                        href={`/search?category=${category}`}
                                        passHref
                                    >
                                        <ListItem
                                            button
                                            component="a"
                                            onClick={() => setSidebarVisible(false)}
                                        >
                                            <ListItemText primary={category} />
                                        </ListItem>
                                    </NextLink>
                                ))}
                                <Divider light />
                            </List>
                        </Drawer>
                        {title === 'Search' ?
                            <Box className='searchSection'>
                                <form onSubmit={submitHandler} className={classes.searchForm}>
                                    <InputBase
                                        name="query"
                                        className={classes.searchInput}
                                        placeholder="Search products"
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                    <IconButton
                                        type="submit"
                                        className={classes.iconButton}
                                        aria-label="search"
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </form>
                            </Box>
                            :
                            null
                        }
                        <Box>
                            <Switch checked={darkMode} onChange={handleDarkMode} />
                            <NextLink passHref href='/cart'>
                                <Link>
                                    {cart.cartItems?.length > 0 ?
                                        <Badge color='secondary' badgeContent={cart.cartItems?.length}>
                                            Cart
                                        </Badge>
                                        :
                                        'Cart'
                                    }
                                </Link>
                            </NextLink>
                            {!userInfo ?
                                <NextLink passHref href='/login'>
                                    <Link>
                                        <Typography component="span">Login</Typography>
                                    </Link>
                                </NextLink>
                                :
                                <>
                                    <Button
                                        ref={anchorRef}
                                        id="composition-button"
                                        aria-controls={open ? 'composition-menu' : undefined}
                                        aria-expanded={open ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleToggle}
                                        className={classes.navbarButton}
                                    >
                                        {userInfo.name}
                                    </Button>
                                    <Popper
                                        open={open}
                                        anchorEl={anchorRef.current}
                                        role={undefined}
                                        placement="bottom-start"
                                        transition
                                        disablePortal
                                        style={{ zIndex: '10000' }}
                                    >
                                        {({ TransitionProps, placement }) => (
                                            <Grow
                                                {...TransitionProps}
                                                style={{
                                                    transformOrigin:
                                                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                                                }}
                                            >
                                                <Paper>
                                                    <ClickAwayListener onClickAway={handleClose}>
                                                        <MenuList
                                                            autoFocusItem={open}
                                                            id="composition-menu"
                                                            aria-labelledby="composition-button"
                                                        >
                                                            <MenuItem
                                                                onClick={() => handleRoute('/profile')}
                                                            >
                                                                Profile
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() => handleRoute('/order-history')}
                                                            >
                                                                Order History
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() => handleRoute('/admin/dashboard')}
                                                            >
                                                                Admin Dashboard
                                                            </MenuItem>
                                                            <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                                                        </MenuList>
                                                    </ClickAwayListener>
                                                </Paper>
                                            </Grow>
                                        )}
                                    </Popper>
                                </>
                            }
                        </Box>
                    </Toolbar>
                </AppBar>
                <Container className={classes.main}>
                    {children}
                </Container>
                <Box component='footer' className={classes.footer}>
                    <Typography>
                        All rights reserved. Next Amazona
                    </Typography>
                </Box>
            </ThemeProvider>
        </div>
    )
}