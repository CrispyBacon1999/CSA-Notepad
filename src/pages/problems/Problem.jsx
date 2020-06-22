import React from "react";
import {
  withStyles,
  Container,
  Grid,
  Typography,
  Hidden,
  Chip,
  Paper,
  Box,
  Avatar,
} from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/firestore";
import { getProblemIcon } from "../../components/Label";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { connect } from "react-redux";
import { Skeleton } from "@material-ui/lab";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
  },
  titleIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: theme.spacing(2),
  },
  comment: {
    color: theme.palette.text.secondary,
    boxShadow: theme.shadows[3],
  },
  commentHeader: {
    minHeight: theme.spacing(4),
    boxShadow: theme.shadows[1],
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
    fontWeight: "bold",
  },
  commentBody: {
    padding: theme.spacing(1),
  },
  commentLine: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    marginBottom: theme.spacing(2),
  },
  commentAvatar: {
    marginRight: theme.spacing(3),
  },
});

class Problem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "",
      comments: [],
    };
    this.loadProblem();
  }

  loadProblem = () => {
    let key = this.props.match.params.key;
    firebase
      .firestore()
      .collection("problems")
      .doc(key)
      .onSnapshot(async (doc) => {
        let prob = doc.data();
        console.log(prob);
        this.setState({
          title: prob.title,
          open: prob.open,
          type: prob.type,
          time: prob.time,
          team: prob.team,
          createdBy: prob.createdBy,
        });
        this.loadUser(prob.createdBy);
        let comments = [
          {
            createdBy: prob.createdBy,
            text: prob.text,
            time: prob.time,
          },
          ...prob.comments,
        ];
        this.setState({
          comments: comments.map((p, index) => ({
            ...p,
            key: `${key}-${index}`,
          })),
        });
      });
  };

  loadUser = (id) => {
    if (!this.props.users.hasOwnProperty(id)) {
      console.log(`Loading user: ${id}`);
      this.props.loadUser(id);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Hidden xsDown>
            <Grid item sm={1} className={classes.titleIcon}>
              {getProblemIcon(this.state.type)}
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={11}>
            <Typography component={"h3"} variant={"h5"}>
              {(this.state.team ? this.state.team + " - " : "") +
                this.state.title}
            </Typography>
          </Grid>
          <Grid item sm={1}>
            <Chip
              size="small"
              style={{
                backgroundColor: this.state.open ? "#00d900" : "#d90000",
                color: this.state.open ? "black" : "white",
              }}
              label={this.state.open ? "Open" : "Resolved"}
              icon={
                this.state.open ? (
                  <ErrorOutlineIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )
              }
            ></Chip>
          </Grid>
          <Grid item sm={11} md={4}>
            <Typography variant={"subtitle2"}>
              Created by{" "}
              {this.props.users[this.state.createdBy]
                ? this.props.users[this.state.createdBy].name
                : "Unknown"}
              {this.state.time ? ` on ${this.state.time.toDate()}` : ""}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid>
              {this.state.comments.map((comment) => (
                <StyledComment
                  key={comment.key}
                  text={comment.text}
                  user={this.props.users[comment.createdBy]}
                  time={comment.time}
                ></StyledComment>
              ))}
            </Grid>
            <Paper>{this.state.text}</Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

class Comment extends React.Component {
  commentTime = () => {
    const now = new Date(Date.now());
    const dt = this.props.time.toDate();
    if (
      now.getFullYear() === dt.getFullYear() &&
      now.getMonth() === dt.getMonth() &&
      now.getDate() === dt.getDate()
    ) {
      return `at ${this.time(dt)}`;
    } else {
      return `on ${this.date(dt)} at ${this.time(dt)}`;
    }
  };

  date = (dt) => {
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    const year = dt.getFullYear();
    return `${month}/${day}/${year}`;
  };

  time = (dt) => {
    var hours = dt.getHours();
    const mins = ("0" + dt.getMinutes()).slice(-2);
    const ampm = hours < 12 && hours !== 0 ? "AM" : "PM";
    hours = hours % 12 || 12;
    return `${hours}:${mins} ${ampm}`;
  };

  render() {
    const { classes } = this.props;
    return (
      <Box className={classes.commentLine}>
        <Avatar
          className={classes.commentAvatar}
          src={this.props.user.pic}
        ></Avatar>
        <Paper className={classes.comment}>
          <Box className={classes.commentHeader}>
            {this.props.user ? (
              this.props.user.name
            ) : (
              <Skeleton animation="wave" />
            )}{" "}
            {this.commentTime()}
          </Box>
          <Box className={classes.commentBody}>{this.props.text}</Box>
        </Paper>
      </Box>
    );
  }
}

const StyledComment = withStyles(styles)(Comment);

export default connect((state) => ({
  users: state.users,
  general: state.general,
}))(withStyles(styles)(Problem));
