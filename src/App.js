import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Collection from "./components/Collection";
import ContractForm from "./components/ContractForm";
import "./App.css";
import Home from "./components/Home";
import HomeButton from "./components/HomeButton";

function App() {
  return (
    <Router>
      <React.Fragment>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/:contractAddress">
          <HomeButton/>
          <Collection />
        </Route>
      </React.Fragment>
    </Router>
  );
}

export default App;
