import React from "react";
import { TextField, withStyles, ButtonGroup, Button } from "@material-ui/core";
import { connect } from "react-redux";
import { editReply } from "../../data/reducers/problem";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(6),
  },
  field: {
    backgroundColor: theme.palette.background.paper,
    fontFamily: "Monospace",
  },
  buttonOpen: {
    background: theme.palette.success.main,
    "&:hover": {
      background: theme.palette.success.dark,
    },
  },
  buttonClose: {
    background: theme.palette.error.main,
    "&:hover": {
      background: theme.palette.error.dark,
    },
  },
});

class Editor extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <TextField
          className={classes.field}
          multiline
          fullWidth
          placeholder="Reply"
          variant="outlined"
          rows={5}
          value={this.props.problem.replyText}
          onChange={(event) => {
            this.props.editReply(event.target.value);
          }}
        ></TextField>
        <ButtonGroup>
          <Button
            className={
              this.props.isOpen ? classes.buttonClose : classes.buttonOpen
            }
            onClick={() => {
              if (this.props.isOpen) {
                this.props.close();
              } else {
                this.props.open();
              }
              this.props.reply();
            }}
          >
            Reply and {this.props.isOpen ? "Close" : "Reopen"}
          </Button>
          <Button>Reply</Button>
        </ButtonGroup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  problem: state.problem,
});

export default connect(mapStateToProps, { editReply })(
  withStyles(styles)(Editor)
);
