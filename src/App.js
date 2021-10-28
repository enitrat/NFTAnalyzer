import * as React from 'react'
import {
  BrowserRouter as Router,
  Link,
  Route
} from 'react-router-dom'
import Collection from './components/Collection'
import ContractForm from './components/ContractForm'
import './App.css'

function App () {
  return (
    <Router>
      <React.Fragment>
      <Route exact path="/">
        <div className="centeredTitle">
          <h1 className="welcomeTitle">NFT Analyzer</h1>
          </div>
		  <ContractForm/>
        </Route>
        <Route exact path="/:contractAddress">
          <Collection/>
        </Route>
      </React.Fragment>
    </Router>
  )
}

export default App;