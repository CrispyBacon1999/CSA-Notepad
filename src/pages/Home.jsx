import React from "react";
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
});

class Home extends React.Component {
  render() {
    return <div></div>;
  }
}

export default connect((state) => ({
  users: state.users,
}))(withStyles(styles)(Home));
