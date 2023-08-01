import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Provider } from 'react-redux';
import store from '@state/store'
import LayoutBasic from './layout';
import Login from './pages/login'
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router basename="/fe-finance-manage">
        <Switch>
          <Route path="/login" component={Login} exact />
          <Route path="/">
            <LayoutBasic />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
