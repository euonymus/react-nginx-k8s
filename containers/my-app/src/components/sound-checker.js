import React, { Component } from 'react';
import Nav from './nav';
import SoundPlayer from './sound-player';

const soundInfo = {
  "key": "Akaiha",
  "name":        "赤い葉",
  "album":       "Lip",
  "file":        "akaiha.mp3",
  "type":        "sound",
  "order":       "3",
  "comment":     "紅葉する京都をイメージした日本的な曲",
  "active":      true
}
class SoundChecker extends Component {
  render() {
    return (
      <div className="SoundChecker">
        <Nav />
        <header className="SoundChecker-header">
          <h1>
            SoundChecker
          </h1>
          <SoundPlayer soundInfo={soundInfo} isPlay={true} selectedSound={soundInfo} soundState="PLAYING" />
        </header>
      </div>
    );
  }
}

export default SoundChecker
