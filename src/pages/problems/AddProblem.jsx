import React from "react";
import { withStyles, Container } from "@material-ui/core";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class AddProblem extends React.Component {
  render() {
    const { classes } = this.props;
    return <Container className={classes.root}>Addproblem</Container>;
  }
}

export default withStyles(styles)(AddProblem);
