import React from "react";
import { connect } from "react-redux";
import {
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import { closeProfileDialog } from "../data/reducers/general";
import { changeUserName } from "../data/reducers/user";

const styles = (theme) => ({
  root: {},
});

class ProfileInfoDialog extends React.Component {
  state = {
    name: "",
  };

  submit = () => {
    changeUserName(this.props.general.signedInUser, this.state.name);
    this.props.close();
    this.setState({ name: "" });
  };

  render() {
    // const { classes } = this.props;
    return (
      <Dialog
        open={this.props.general.profileNameDialog}
        onClose={this.props.close}
      >
        <DialogTitle>Edit Profile Name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We need a display name before you you can start using this tool.
            This will help others be able to contact you easily.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Display Name"
            fullWidth
            value={this.state.name}
            onChange={(event) => {
              this.setState({
                name: event.target.value,
              });
            }}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={this.state.name.trim().length < 2}
            onClick={this.submit}
          >
            Save Name
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(
  (state) => ({
    general: state.general,
    user: state.user,
  }),
  {
    close: closeProfileDialog,
  }
)(withStyles(styles)(ProfileInfoDialog));
