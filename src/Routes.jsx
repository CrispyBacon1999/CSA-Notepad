import React from "react";
import { Route } from "react-router-dom";
import {
  Home,
  Account,
  AddEvent,
  AddProblem,
  Problem,
  NotFound
} from "./pages";

const routes = routeprops => [
  <Route
    key="route-account"
    exact
    path="/account"
    render={props => <Account {...props} {...routeprops} />}
  />,
  <Route
    key="route-account-add-event"
    exact
    path="/account/addEvent"
    render={props => <AddEvent {...props} {...routeprops} />}
  />,
  <Route
    key="route-problem-add"
    exact
    path="/problems/add"
    render={props => <AddProblem {...props} {...routeprops} />}
  />,
  <Route
    key="route-problem"
    path="/problems/:key"
    render={props => <Problem {...props} {...routeprops} />}
  />,
  <Route
    key="route-index"
    exact
    path="/"
    render={props => <Home {...props} {...routeprops} />}
  />,
  <Route key="404" path="*" render={props => <NotFound />} />
];
export default routes;
