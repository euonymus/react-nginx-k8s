import _ from 'lodash';
import { Component } from 'react';
import { Howl } from 'howler';

const EMPTY   = 'EMPTY';
const LOADING = 'LOADING';
const READY   = 'READY';
const PAUSE   = 'PAUSE';
const PLAYING = 'PLAYING';

class SoundPlayer extends Component {
  state = {
    soundName:        null,
    soundState:      EMPTY,
    waveDataState:   EMPTY,
  }

  componentDidMount() {
    this.soundProgress = 0;
    this.timeStock = 0;
    this.soundDuration = 0;
    this.isStreaming = false;
    this.hasWaveData = false;
    this.waveData = null;
    this.waveDataIdx = 0;
    this.init();
  }

  forceBrowserReload = () => {
    if(this.state.soundState === PAUSE){
      console.log('page reload');
      window.location.reload();
    }
  }


  componentWillUnmount() {
    this.stop();
  }



  getSnapshotBeforeUpdate = (prevProps, prevState) => {
console.log("getSnapshotBeforeUpdate")
console.log(this.props.soundState)
    if(_.isEqual(this.props.soundInfo, this.props.selectedSound)){
console.log('in')
      // if(this.props.cutIn.isRewinding === true){
      //   this.replay();
      // }

      if(this.props.soundState === PLAYING){
console.log("in PLAYING")
        this.play();
      }else if(this.props.soundState === PAUSE){
        this.pause();
      }else if(this.props.soundState === READY){
        this.stop();
      }

      // if(this.props.cutIn.isJinglePlay !== prevProps.cutIn.isJinglePlay){
      //   this.cutIn();
      // }
    }else{
      if((this.state.soundState === PLAYING)||(this.state.soundState === PAUSE)){
        this.stop();
      }
    }
    // if(!_.isEqual(this.props.soundInfo, prevProps.soundInfo)){
    //   this.stop();
    //   this.init();
    // }
    // if(this.props.cutIn.isRewinding === true){
    //   this.replay();
    // }
    // if(this.state.isLoop !== this.props.isLoopOne){
    //   this.setState({isLoop: this.props.isLoopOne});
    //   this.sound.loop(this.props.isLoopOne);
    // }

    // if(this.props.soundState === PLAYING){
    //   this.play();
    // }else if(this.props.soundState === PAUSE){
    //   this.pause();
    // }else if(this.props.soundState === READY){
    //   this.stop();
    // }

    // if(this.props.cutIn.isJinglePlay !== prevProps.cutIn.isJinglePlay){
    //   this.cutIn();
    // }
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //getSnapshotBeforeUpdate needs this function
  }

  init() {
    if (!this.props.soundInfo) {
      return false
    }

    const { soundInfo } = this.props;
    const soundFileName = soundInfo.file;
    this.setState({ soundName: soundInfo.name });

    if (this.props.soundInfo.type === "sometype") {
      this.fetchWaveData(soundFileName);
    } else {
      this.hasWaveData = false;
      this.setState({ waveDataState: EMPTY });
    }

    // console.log('init: ' + soundFileName);
    this.sound = this.generateHowl(soundFileName);
  }

  fetchWaveData = (_soundFileName) => {
    this.setState({ waveDataState: LOADING })

    let PATH = '/assets/jsons/' + _soundFileName +'.json'
    return fetch(PATH)
      .then((response) => {
        return response.json()
      }).then((json) => {
        this.waveData = this.utilizeWaveData(json);
        this.setState({ waveDataState: READY })
      }).catch((e) => {
        console.error(e)
      })
  }

  generateHowl = (_songFileName) => {
    this.setState({soundState: LOADING});

    let options = {
      src: [`/assets/sounds/${_songFileName}`],
      format: ['mp3','m4a'],
      volume:1.0,
      loop:true,
      onload:()=>{
        this.soundDuration = Math.round(this.sound.duration() *10) / 10;
        this.setState({soundState: READY});
      },
      onplay:() => {//called when music actually starts playing
        // this.setState({
        //   soundState: PLAYING,
        // });
      },
      onend:() => {//called when music ends (and restarts in case loop is set true)
        this.props.onEnd();
        // this.timeStock += this.soundDuration;
        this.waveDataIdx = 0;
        // console.log('onend')
      },
      onseek:() => {
        // console.log('seek');
        this.timeStock += this.soundProgress;
      }
    }

    if (this.isStreaming) {
      options = {
        ...options,
        html5: true, // A live stream can only be played through HTML5 Audio.
        preload: false,
      }
    } else {
      options = {
        ...options,
        html5: false,
        preload: true,
      }
    }
    return new Howl(options)
  }

  play = () => {
    const INTERVAL_OF_PROGRESS_UPDATE = 1000; //[ms]
    if (this.state.soundState === READY || this.state.soundState === PAUSE) {
      // if (this.state.soundState === READY) {
      //   // API Call: Sound Actions Start
      //   const params = { sound_id: this.props.soundInfo.key, action: 'start' }
      // }

      this.sound.volume(1.0);
      this.sound.play();
      this.progressUpdater = window.setInterval( this.updateSoundProgress, INTERVAL_OF_PROGRESS_UPDATE);
      this.setState({soundState: PLAYING});
    }
  }

  replay = () =>{
    this.sound.seek(0);
    this.props.finishRewind();
  }

  pause = () => {
    if(this.state.soundState === PLAYING){
      const DURATION = 50; //[ms]
      this.sound.fade(1, 0, DURATION);
      window.setTimeout( () => {this.sound.pause()}, DURATION);
      window.clearInterval(this.progressUpdater);

      this.setState({soundState: PAUSE});
    }
  }

  stop = () => {
    // if (this.state.soundState !== READY) {
      const DURATION = 50; //[ms]
      this.sound.fade(1, 0, DURATION);
      window.clearInterval(this.progressUpdater);

      window.setTimeout( () => {this.sound.stop()}, DURATION);
      this.setState({soundState: READY});
      // }
  }

  cutIn =() =>{
    const FADE_DURATION = 1000;
    const BOTTOM_VOLUME = 0.2;
    if(this.props.cutIn.isJinglePlay){
    // console.log('fadeOut')
      this.sound.fade(1, BOTTOM_VOLUME, FADE_DURATION);
      window.setTimeout(this.props.jingleCallbackPlay, FADE_DURATION);
    }else{
    // console.log('fadeIn')
      this.sound.fade(BOTTOM_VOLUME, 1, FADE_DURATION);
    }
  }

  setVolume(vol) {
    this.sound.volume(vol);
  }

  updateSoundProgress = () => {
    // let volume = 0;
    // let frequency = 0;

    this.soundProgress = this.getSoundProgress();

    if (this.hasWaveData) {
      this.waveDataIdx = this.seekMusicData(this.soundProgress);
      if (this.waveDataIdx === false) {
        return false
      }
      // volume = this.getVolumeData(this.waveDataIdx);
      // frequency = this.getFrequencyData(this.waveDataIdx);
    }
  }

  getSoundProgress() {
    if (this.state.soundState !== PLAYING) {
      return 0
    }
    let time = Math.round(this.sound.seek() * 10) / 10;
    return time
  }

  seekMusicData(seconds) {
    let index = this.waveDataIdx;

    if (!(index in this.waveData)) {
      window.clearInterval(this.progressUpdater);
      return false
    }

    if (seconds >= this.waveData[index].time) {
      ++index;
    }
    return index
  }

  getVolumeData(index) {
    if (this.waveData[index] != null) {
      return this.waveData[index].vol
    } else {
      return 0
    }
  }

  getFrequencyData(index) {
    if (this.waveData[index] != null) {
      return this.waveData[index].fft
    } else {
      return 0
    }
  }

  utilizeWaveData = (val) => {
    let ret = [];
    let val_length = val.length;
    for (let i = 0; i < val_length; i++) {
      let data = {};
      data.time = val[i].time;
      delete val[i].time;
      data.vol = val[i].vol;
      delete val[i].vol;
      data.fft = this.dicToArray(val[i]);
      ret.push(data);
    }
    return ret
  }

  dicToArray = (dic) => {
    let array=[];
    let i = 0;
    for (let key in dic) {
      array[i] = dic[key];
      ++i;
    }
    return array
  }

  render() {
    return null
  }
}
export default SoundPlayer
