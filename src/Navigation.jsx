import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";

import { Switch, Route, BrowserRouter } from "react-router-dom";

import { mainListItems, secondaryListItems } from "./listItems";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  withStyles,
  Drawer,
  Divider,
  List,
  Avatar,
  Menu,
  MenuItem,
  Fade,
  CircularProgress
} from "@material-ui/core";
import Login from "./pages/Login";
import * as firebase from "firebase/app";
import "firebase/auth";

import routes from "./Routes";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex",
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  title: {
    flexGrow: 1
  },
  toolbar: {
    paddingRight: 24
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  menuButtonHidden: {
    display: "none"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  }
});

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      drawerOpen: false
    };
    firebase.auth().onAuthStateChanged(this.authStateChanged);
  }

  authStateChanged = user => {
    if (user) {
      console.log(user);
      this.setState({ user });
    } else {
      console.log("No user signed in");
      this.setState({ user: null });
    }
  };

  handleDrawerClose = () => {
    this.setState({
      drawerOpen: false
    });
  };

  handleDrawerOpen = () => {
    this.setState({
      drawerOpen: true
    });
  };

  handleOpenAccountMenu = event => {
    this.setState({
      dropdownEl: event.currentTarget
    });
  };

  handleCloseAccountMenu = () => {
    this.setState({
      dropdownEl: null
    });
  };

  handleLogout = () => {
    firebase.auth().signOut();
    this.handleCloseAccountMenu();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.user ? (
          <BrowserRouter>
            <div className={classes.root}>
              <CssBaseline />
              <AppBar
                position="absolute"
                className={clsx(
                  classes.appBar,
                  this.state.drawerOpen && classes.appBarShift
                )}
              >
                <Toolbar>
                  <IconButton
                    onClick={this.handleDrawerOpen}
                    edge="start"
                    className={clsx(
                      classes.menuButton,
                      this.state.drawerOpen && classes.menuButtonHidden
                    )}
                    color="inherit"
                    aria-label="menu"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                    CSA Notepad
                  </Typography>
                  <IconButton onClick={this.handleOpenAccountMenu}>
                    {this.state.user ? (
                      <AccountCircleIcon fontSize="large" />
                    ) : (
                      <AccountCircleOutlinedIcon fontSize="large" />
                    )}
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={this.state.dropdownEl}
                    open={!!this.state.dropdownEl}
                    onClose={this.handleCloseAccountMenu}
                    onClick={this.handleCloseAccountMenu}
                  >
                    <MenuItem onClick={this.handleAccountRoute}>
                      Account
                    </MenuItem>
                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                  </Menu>
                </Toolbar>
              </AppBar>
              <Drawer
                variant="permanent"
                classes={{
                  paper: clsx(
                    classes.drawerPaper,
                    !this.state.drawerOpen && classes.drawerPaperClose
                  )
                }}
                open={this.state.drawerOpen}
              >
                <div className={classes.toolbarIcon}>
                  <IconButton onClick={this.handleDrawerClose}>
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                <Divider />
                <List>{mainListItems}</List>
                <Divider />
                <List>{secondaryListItems}</List>
              </Drawer>
              <div className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Switch>
                  {routes({
                    user: this.state.user
                  })}
                </Switch>
              </div>
            </div>
          </BrowserRouter>
        ) : this.state.user === undefined ? (
          <Fade
            in={this.state.user === undefined}
            style={{
              transitionDelay: this.state.user === undefined ? "800ms" : "0ms"
            }}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
        ) : (
          <Login></Login>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Navigation);
