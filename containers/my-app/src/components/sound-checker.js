import React, { Component } from 'react';
import Nav from './nav';

class SoundChecker extends Component {
  render() {
    return (
      <div className="SoundChecker">
        <Nav />
        <header className="SoundChecker-header">
          <h1>
            SoundChecker
          </h1>
        </header>
      </div>
    );
  }
}

export default SoundChecker
