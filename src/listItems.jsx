import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountIcon from "@material-ui/icons/AccountCircle";
import { Link as RouterLink } from "react-router-dom";

export const mainListItems = (
  <div>
    <ListItem button component={RouterLink} to="/">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText>Dashboard</ListItemText>
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListItem button component={RouterLink} to="/account">
      <ListItemIcon>
        <AccountIcon />
      </ListItemIcon>
      <ListItemText>Account</ListItemText>
    </ListItem>
  </div>
);
