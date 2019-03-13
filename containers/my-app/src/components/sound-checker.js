import React, { Component } from 'react';
import Nav from './nav';
import SoundPlayer from './sound-player';

const soundInfo = {
  "key": "Sazanka",
  "name":        "サザンカ",
  "album":       "Lip",
  "file":        "Sazanka.mp3",
  "type":        "sound",
  "order":       "3",
  "comment":     "2018年、日本放送協会（NHK）\n平昌オリンピックの放送テーマソング。\n「夢を追う人を応援する人」の目線で、\nやさしく、強く、包み込む名作。",
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
