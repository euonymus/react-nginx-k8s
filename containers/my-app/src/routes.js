// react
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './components/app';
import SoundChecker from './components/sound-checker';

class AppRoutes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={App} />
          <Route exact path='/sound-checker' component={SoundChecker} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default AppRoutes
