import Home from './pages/Home'
import Redirects from './pages/Redirects'
import NotFound from './pages/NotFound'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import './App.css';


function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/not-found" exact component={NotFound}/>
          <Route path="/:slug" exact component={Redirects}/>
        </Switch>
      </Router>
    </>
  );
}

export default App;
