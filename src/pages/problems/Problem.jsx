import React from "react";
import {
  withStyles,
  Container,
  Grid,
  Typography,
  Hidden,
  Chip,
  Paper
} from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/firestore";
import { getProblemIcon } from "../../components/Label";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(3)
  },
  titleIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: theme.spacing(2)
  },
  comment: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2)
  }
});

class Problem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "",
      comments: []
    };
    this.loadProblem();
  }

  loadProblem = () => {
    let key = this.props.match.params.key;
    firebase
      .firestore()
      .collection("problems")
      .doc(key)
      .onSnapshot(async doc => {
        let prob = doc.data();
        console.log(prob);
        this.setState({
          title: prob.title,
          open: prob.open,
          type: prob.type,
          time: prob.time,
          team: prob.team
        });
        prob.createdBy.onSnapshot(async user => {
          this.setState({
            createdBy: user.data()
          });
        });
        let comments = [
          {
            createdBy: prob.createdBy,
            text: prob.text,
            time: prob.time
          },
          ...prob.comments
        ];
        this.setState({
          comments: comments
        });
      });
  };

  render() {
    const {
      classes,
      match: { params }
    } = this.props;
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
                color: this.state.open ? "black" : "white"
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
              {this.state.createdBy ? this.state.createdBy.name : "Unknown"}{" "}
              {/* created this on {this.state.time} */}
            </Typography>
          </Grid>
          <Grid item sm={12} md={7}>
            <Typography variant={"subtitle2"}>
              Created by{" "}
              {this.state.createdBy ? this.state.createdBy.name : "Unknown"}{" "}
              {/* created this on {this.state.time} */}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {this.state.comments.map(comment => (
              <Paper className={classes.comment}>{comment.text}</Paper>
            ))}
            <Paper>{this.state.text}</Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(Problem);
