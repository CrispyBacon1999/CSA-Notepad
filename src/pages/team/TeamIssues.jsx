import React from "react";
import { withStyles, Container } from "@material-ui/core";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class TeamIssues extends React.Component {
  render() {
    const { classes } = this.props;
    return <Container className={classes.root}>Team Issues</Container>;
  }
}

export default withStyles(styles)(TeamIssues);
