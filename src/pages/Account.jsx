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
  ListItemText,
  ListItemIcon,
  Badge,
} from "@material-ui/core";

import { Link as RouterLink } from "react-router-dom";

import { getProblemIcon } from "../components/Label";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(6),
  },
  avatar: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
  paper: {
    padding: theme.spacing(4),
  },
  userName: {
    marginBottom: theme.spacing(3),
  },
});

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      problems: [],
    };
    this.getEvents();
    this.getProblems();
  }

  getProblems = async () => {
    var userRef = firebase
      .firestore()
      .collection("users")
      .doc(this.props.user.uid);
    var problems = firebase
      .firestore()
      .collection("problems")
      .where("createdBy", "==", userRef);
    problems.onSnapshot((snapshot) => {
      console.log(snapshot.docs.length);
      var p = snapshot.docs.map((prob) => {
        var x = prob.data();
        x.key = prob.id;
        if (x.comments) {
          x.commentCount = x.comments.length;
        }
        return x;
      });

      this.setState({
        problems: p,
      });
    });
  };

  getEvents = async () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.props.user.uid)
      .onSnapshot(async (doc) => {
        var events = doc.data().events.map(async (event) => {
          var e = await event.get();
          var eventObj = e.data();
          eventObj.key = e.id;
          return eventObj;
        });
        events = await Promise.all(events);
        this.setState({
          events: events,
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
                {this.state.events.map((event) => (
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
                Reported Problems
              </Typography>
              <List>
                {this.state.problems.map((problem) => (
                  <ListItem
                    button
                    key={problem.key}
                    component={RouterLink}
                    to={`/problems/${problem.key}`}
                  >
                    <ListItemIcon>
                      <Badge
                        badgeContent={problem.commentCount || 0}
                        color="primary"
                      >
                        {getProblemIcon(problem.type)}
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={problem.title}
                      secondary={problem.team}
                    ></ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(Account);
