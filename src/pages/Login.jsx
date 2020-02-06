import React from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import {
  withStyles,
  Container,
  Paper,
  TextField,
  Typography,
  Avatar,
  FormControlLabel,
  Checkbox,
  Button
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(2)
  }
});

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    remember: true
  };

  handleEmailSignIn = () => {
    var email = this.state.email;
    var password = this.state.password;
    var remember = this.state.remember;
    firebase
      .auth()
      .setPersistence(
        remember
          ? firebase.auth.Auth.Persistence.LOCAL
          : firebase.auth.Auth.Persistence.SESSION
      )
      .then(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(auth => {
            console.log("Successfully signed in");
          })
          .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode, errorMessage);
          });
      })
      .catch(error => {
        console.error(error.errorCode, error.errorMessage);
      });
  };

  handleGoogleSignIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        console.log(result);
      });
  };

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };
  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };
  handleRememberChange = value => {
    this.setState({ remember: value });
  };

  render() {
    const { classes } = this.props;
    return (
      <Container maxWidth="xs">
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <div className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              id="password"
              label="Password"
              name="password"
              autoComplete="current-password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  value={this.state.remember}
                  onChange={this.handleRememberChange}
                />
              }
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleEmailSignIn}
            >
              Login
            </Button>
            <Button variant="outlined" onClick={this.handleGoogleSignIn}>
              <Avatar
                variant="rounded"
                src="assets/login/google.png"
                className={classes.small}
              ></Avatar>
              Login With Google
            </Button>
          </div>
        </Paper>
      </Container>
    );
  }
}

export default withStyles(styles)(Login);
