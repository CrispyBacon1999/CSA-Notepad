import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core";

export function Themed(props) {
  const user = props.users[props.general.signedInUser];
  const darkTheme =
    user !== undefined &&
    user.preferences !== undefined &&
    user.preferences.darkTheme !== undefined
      ? user.preferences.darkTheme
      : undefined;
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type:
            darkTheme !== undefined
              ? darkTheme
                ? "dark"
                : "light"
              : prefersDark
              ? "dark"
              : "light",
        },
      }),
    [darkTheme, prefersDark]
  );
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
