import React from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { withStyles, Container, Avatar } from "@material-ui/core";

const styles = theme => ({
  root: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(6)
  },
  avatar: {
    width: theme.spacing(9),
    height: theme.spacing(9)
  }
});

class Account extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.root}>
        <Avatar
          src={this.props.user.photoUrl}
          size="large"
          className={classes.avatar}
        ></Avatar>
      </Container>
    );
  }
}

export default withStyles(styles)(Account);
