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
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { connect } from "react-redux";
import {
  Skeleton,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
} from "@material-ui/lab";
import Editor from "./Editor";
import {
  loadProblem,
  closeProblem,
  openProblem,
  deleteComment,
  sendReply,
} from "../../data/reducers/problem";
import clsx from "clsx";

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
  timelineItem: {
    "&::before": {
      flex: 0,
      padding: 0,
    },
  },
  comment: {
    color: theme.palette.text.secondary,
    boxShadow: theme.shadows[3],
  },
  connectorHidden: {
    backgroundColor: "transparent",
  },
  commentHeader: {
    minHeight: theme.spacing(4),
    boxShadow: theme.shadows[1],
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
    fontWeight: "bold",
  },
  avatarOpen: {
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.getContrastText(theme.palette.success.dark),
  },
  avatarClose: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.getContrastText(theme.palette.error.dark),
  },
  commentBody: {
    padding: theme.spacing(1),
  },
  commentLine: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    marginBottom: theme.spacing(2),
    "&::before": {
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderWidth: "10px 15px 10px 0",
      borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
      content: "' '",
      zIndex: 100,
      marginTop: theme.shape.borderRadius,
      filter:
        "drop-shadow(-2px 3px 2px rgba(0,0,0,0.14)) drop-shadow(-4px 1px 4px rgba(0,0,0,0.12))",
    },
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
              label={problem.open ? "Open" : "Resolved"}
              className={
                problem.open ? classes.avatarOpen : classes.avatarClose
              }
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
            <Timeline className={classes.timeline}>
              {problem.comments.map((commentID, index) => {
                var comment =
                  commentID in this.props.comments
                    ? this.props.comments[commentID]
                    : {};
                return (
                  <StyledComment
                    key={commentID}
                    text={comment.text}
                    user={this.props.users[comment.createdBy]}
                    time={comment.time}
                    type={comment.type}
                    base={comment.base || false}
                    createdByCurrentUser={
                      comment.createdBy === this.props.general.signedInUser
                    }
                    first={index === 0}
                    last={problem.comments.length === index + 1}
                  ></StyledComment>
                );
              })}

              <Paper>{this.state.text}</Paper>
            </Timeline>
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
    if (this.props.time) {
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
    }
    return "";
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

  inner = () => {
    switch (this.props.type) {
      case "open":
        return (
          <TimelineContent>
            <Typography variant="subtitle1">
              {this.props.user && this.props.user.name} reopened this issue on{" "}
              {this.commentTime()}
            </Typography>
          </TimelineContent>
        );
      case "close":
        return (
          <TimelineContent>
            <Typography variant="subtitle1">
                {this.props.user && this.props.user.name} closed this on{" "}
            </Typography>
          </TimelineContent>
        );
      default:
        return <TimelineContent>{this.message()}</TimelineContent>;
    }
  };

  separator = () => {
              
    const { classes } = this.props;
    switch (this.props.type) {
      case "open":
      case "close":
        return (
          <TimelineSeparator>
            {/* <TimelineConnector
              className={clsx({ [classes.connectorHidden]: this.props.first })}
            ></TimelineConnector> */}

            <Avatar
              className={clsx({
                [classes.avatarOpen]: this.props.type === "open",
                [classes.avatarClose]: this.props.type === "close",
              })}
            >
              {this.props.type === "close" ? (
                <CheckCircleOutlineIcon />
              ) : this.props.type === "open" ? (
                <ErrorOutlineIcon />
              ) : (
                <InfoOutlinedIcon />
              )}
            </Avatar>

            <TimelineConnector
              className={clsx({ [classes.connectorHidden]: this.props.last })}
            ></TimelineConnector>
          </TimelineSeparator>
        );
      default:
        return (
          <TimelineSeparator>
            {/* <TimelineConnector
              className={clsx({ [classes.connectorHidden]: this.props.first })}
            ></TimelineConnector> */}
            {this.props.user ? (
              <Avatar src={this.props.user && this.props.user.pic}></Avatar>
            ) : (
              <Skeleton variant="circle">
                <Avatar />
              </Skeleton>
            )}
            <TimelineConnector
              className={clsx({ [classes.connectorHidden]: this.props.last })}
            ></TimelineConnector>
          </TimelineSeparator>
        );
    }
  };

  message = () => {
    const { classes } = this.props;
    return (
      <div
        onContextMenu={this.handleContextMenu}
        style={{ cursor: "context-menu" }}
      >
        <Box className={classes.commentLine}>
          <Paper className={classes.comment}>
            <Box className={classes.commentHeader}>
              <Typography variant="subtitle1">
                <b>
                  {this.props.user ? (
                    this.props.user.name
                  ) : (
                    <Skeleton animation="wave" />
                  )}
                </b>{" "}
                {this.commentTime()}
              </Typography>
            </Box>
            <Box className={classes.commentBody}>
              <Typography variant="body1">{this.props.text}</Typography>
            </Box>
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
            disabled={this.props.base || !this.props.createdByCurrentUser}
            onClick={() => this.props.delete(this.props.index)}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <TimelineItem className={classes.timelineItem}>
        {this.separator()}
        {this.inner()}
      </TimelineItem>
    );
  }
}

const StyledComment = withStyles(styles)(Comment);

export default connect(
  (state) => ({
    users: state.users,
    general: state.general,
    problem: state.problem,
    comments: state.comments,
  }),
  {
    loadProblem: loadProblem,
    open: openProblem,
    close: closeProblem,
    delete: deleteComment,
    reply: sendReply,
  }
)(withStyles(styles)(Problem));
