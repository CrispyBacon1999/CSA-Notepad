import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import EventIcon from "@material-ui/icons/Event";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

import { Switch, BrowserRouter, Link as RouterLink } from "react-router-dom";

import { connect } from "react-redux";

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
  CircularProgress,
} from "@material-ui/core";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import Login from "./pages/Login";
import * as firebase from "firebase/app";
import "firebase/auth";

import routes from "./Routes";
import {
  toggleDrawer,
  toggleActionsMenu,
  signIn,
} from "./data/reducers/general";
import { Themed } from "./theme";
import { updateUserProfilePicture, loadUser } from "./data/reducers/user";
const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuButtonHidden: {
    display: "none",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  actionsDot: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
});

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      drawerOpen: false,
      actionsOpen: false,
    };

    firebase
      .firestore()
      .enablePersistence()
      .catch((err) => {
        if (err.code === "failed-precondition") {
          console.warn(
            "Multiple tabs open. Can only be enabled in one tab at a time"
          );
        } else if (err.code === "unimplemented") {
          console.warn("Not enough browser support for persistence.");
        }
      });
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.authStateChanged);
  }

  authStateChanged = (user) => {
    if (user) {
      this.props.loadUser(user.uid);
      this.props.signIn(user.uid);
      updateUserProfilePicture(user.uid, user.photoURL);
    } else {
      this.props.signIn(undefined);
      console.log("No user signed in");
    }
  };

  handleDrawerClose = () => {
    this.setState({
      drawerOpen: false,
    });
  };

  handleDrawerOpen = () => {
    this.setState({
      drawerOpen: true,
    });
  };

  handleOpenAccountMenu = (event) => {
    this.setState({
      dropdownEl: event.currentTarget,
    });
  };

  handleCloseAccountMenu = () => {
    this.setState({
      dropdownEl: null,
    });
  };

  handleLogout = () => {
    firebase.auth().signOut();
    this.handleCloseAccountMenu();
  };

  handleToggleActions = () => {
    this.setState({
      actionsOpen: !this.state.actionsOpen,
    });
  };

  handleCloseAction = () => {
    this.setState({
      actionsOpen: false,
    });
  };

  actions = [
    {
      icon: <EventIcon />,
      name: "Join Event",
      action: () => {},
      link: "/account/addEvent",
    },
    {
      icon: <ReportProblemIcon />,
      name: "Add Problem",
      action: () => {},
      link: "/problems/add",
    },
  ];

  render() {
    const { classes } = this.props;
    const currentUser =
      this.props.general.signedInUser === undefined
        ? null
        : this.props.users[this.props.general.signedInUser];

    return (
      <Themed {...this.props}>
        {currentUser ? (
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
                  <Button onClick={this.handleOpenAccountMenu}>
                    <Avatar
                      src={
                        currentUser ? (
                          currentUser.photoURL
                        ) : (
                          <IconButton onClick={this.handleOpenAccountMenu}>
                            {currentUser ? (
                              <AccountCircleIcon fontSize="large" />
                            ) : (
                              <AccountCircleOutlinedIcon fontSize="large" />
                            )}
                          </IconButton>
                        )
                      }
                    ></Avatar>
                  </Button>
                  <Menu
                    id="menu-appbar"
                    anchorEl={this.state.dropdownEl}
                    open={!!this.state.dropdownEl}
                    onClose={this.handleCloseAccountMenu}
                    onClick={this.handleCloseAccountMenu}
                  >
                    <MenuItem component={RouterLink} to="/account">
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
                  ),
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
                <Switch>{routes({})}</Switch>
              </div>
            </div>
            <SpeedDial
              className={classes.actionsDot}
              ariaLabel="Quick Actions"
              hidden={this.state.actionsHidden}
              open={this.state.actionsOpen}
              onClick={this.handleToggleActions}
              direction="up"
              icon={<SpeedDialIcon />}
            >
              {this.actions.map((action) => (
                <SpeedDialAction
                  to={action.link}
                  component={RouterLink}
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={() => {
                    action.action();
                    this.handleCloseAction();
                  }}
                />
              ))}
            </SpeedDial>
          </BrowserRouter>
        ) : currentUser === undefined ? (
          <Fade
            in={currentUser === undefined}
            style={{
              transitionDelay: currentUser === undefined ? "800ms" : "0ms",
            }}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
        ) : (
          <Login></Login>
        )}
      </Themed>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.users,
  general: state.general,
});
const mapDispatchToProps = {
  toggleActionsMenu: toggleActionsMenu,
  toggleDrawer: toggleDrawer,
  loadUser: loadUser,
  signIn: signIn,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Navigation));
