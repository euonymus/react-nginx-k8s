import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
  render() {
    return (
      <div className="Nav">
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/sound-checker'>Sound Checker</Link></li>
        </ul>
      </div>
    );
  }
}

export default Nav;
