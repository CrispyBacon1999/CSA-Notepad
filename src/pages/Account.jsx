import React from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  withStyles,
  Container,
  Avatar,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";

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
  },
  paper: {
    padding: theme.spacing(4)
  },
  userName: {
    marginBottom: theme.spacing(3)
  }
});

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    this.getEvents();
  }

  getEvents = async () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.props.user.uid)
      .onSnapshot(async doc => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        var events = doc.data().events.map(async event => {
          var e = await event.get();
          var eventObj = e.data();
          eventObj.key = e.id;
          return eventObj;
        });
        events = await Promise.all(events);
        this.setState({
          events: events
        });
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.root}>
        <Avatar
          src={this.props.user.photoURL}
          size="large"
          className={classes.avatar}
        ></Avatar>
        <Typography component="h1" variant="h5" className={classes.userName}>
          {this.props.user.displayName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography component="h3" variant="h6">
                Events
              </Typography>
              <List>
                {this.state.events.map(event => (
                  <ListItem button key={event.key}>
                    <ListItemText
                      primary={event.name}
                      key={event.key}
                    ></ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography component="h3" variant="h6">
                Test
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(Account);
