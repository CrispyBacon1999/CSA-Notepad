import React from "react";
import { Route } from "react-router-dom";
import { Home, Account } from "./pages";

const routes = routeprops => [
  <Route
    exact
    path="/account"
    render={props => <Account {...props} {...routeprops} />}
  />,
  <Route path="/" render={props => <Home {...props} {...routeprops} />} />
];
export default routes;
