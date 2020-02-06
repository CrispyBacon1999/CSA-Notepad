import React from "react";
import { Route } from "react-router-dom";
import { Home, Account } from "./pages";

const routes = routeprops => [
  <Route
    key="route-accout"
    exact
    path="/account"
    render={props => <Account {...props} {...routeprops} />}
  />,
  <Route
    key="route-index"
    path="/"
    render={props => <Home {...props} {...routeprops} />}
  />
];
export default routes;
