import React from "react";
import {
  withStyles,
  Container,
  Grid,
  Typography,
  Hidden,
  Chip
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
          createdBy: prob.createdBy,
          time: prob.time
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
        <Grid container>
          <Hidden xsDown>
            <Grid item sm={1} className={classes.titleIcon}>
              {getProblemIcon(this.state.type)}
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={11}>
            <Typography component={"h3"} variant={"h5"}>
              {this.state.title}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={11}>
            <Chip
              size="small"
              color={this.state.open ? "secondary" : "primary"}
              label={this.state.open ? "Open" : "Resolved"}
              icon={
                this.state.open ? (
                  <ErrorOutlineIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )
              }
            ></Chip>

            <Typography variant={"subtitle1"}>
              {/* {this.state.createdBy} created this on {this.state.time} */}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(Problem);
