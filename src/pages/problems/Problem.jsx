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
  Menu,
  MenuItem,
} from "@material-ui/core";

import { getProblemIcon } from "../../components/Label";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { connect } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import Editor from "./Editor";
import {
  loadProblem,
  closeProblem,
  openProblem,
  sendReply,
} from "../../data/reducers/problem";

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
    this.props.loadProblem(props.match.params.key);
  }

  loadUser = (id) => {
    if (!this.props.users.hasOwnProperty(id)) {
      console.log(`Loading user: ${id}`);
      this.props.loadUser(id);
    }
  };

  render() {
    const { classes } = this.props;
    const problem = this.props.problem;
    return (
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Hidden xsDown>
            <Grid item sm={1} className={classes.titleIcon}>
              {getProblemIcon(problem.type)}
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={11}>
            <Typography component={"h3"} variant={"h5"}>
              {(problem.team ? problem.team + " - " : "") + problem.title}
            </Typography>
          </Grid>
          <Grid item sm={1}>
            <Chip
              size="small"
              style={{
                backgroundColor: problem.open ? "#00d900" : "#d90000",
                color: problem.open ? "black" : "white",
              }}
              label={problem.open ? "Open" : "Resolved"}
              icon={
                problem.open ? <ErrorOutlineIcon /> : <CheckCircleOutlineIcon />
              }
            ></Chip>
          </Grid>
          <Grid item sm={11} md={4}>
            <Typography variant={"subtitle2"}>
              Created by{" "}
              {this.props.users[problem.createdBy]
                ? this.props.users[problem.createdBy].name
                : "Unknown"}
              {this.state.time ? ` on ${this.state.time.toDate()}` : ""}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid>
              {problem.comments.map((comment) => (
                <StyledComment
                  key={comment.key}
                  text={comment.text}
                  user={this.props.users[comment.createdBy]}
                  time={comment.time}
                  createdByCurrentUser={
                    comment.createdBy === this.props.general.signedInUser
                  }
                ></StyledComment>
              ))}
            </Grid>
            <Paper>{this.state.text}</Paper>
          </Grid>
          <Grid item xs={12}>
            <Editor
              isOpen={problem.open}
              close={this.props.close}
              open={this.props.open}
              reply={this.props.reply}
            ></Editor>
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

  state = {
    mouseX: null,
    mouseY: null,
  };

  handleContextMenu = (event) => {
    event.preventDefault();
    this.setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };
  handleClose = () => {
    this.setState({
      mouseX: null,
      mouseY: null,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div
        onContextMenu={this.handleContextMenu}
        style={{ cursor: "context-menu" }}
      >
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
        <Menu
          keepMounted
          open={this.state.mouseY !== null}
          onClose={this.handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            this.state.mouseY !== null && this.state.mouseX !== null
              ? { top: this.state.mouseY, left: this.state.mouseX }
              : undefined
          }
        >
          <MenuItem
            disabled={!this.props.createdByCurrentUser}
            onClick={() => this.props.delete()}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

const StyledComment = withStyles(styles)(Comment);

export default connect(
  (state) => ({
    users: state.users,
    general: state.general,
    problem: state.problem,
  }),
  {
    loadProblem: loadProblem,
    open: openProblem,
    close: closeProblem,
    reply: sendReply,
  }
)(withStyles(styles)(Problem));
