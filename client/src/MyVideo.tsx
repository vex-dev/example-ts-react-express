import React from 'react';
import Video from './Video';
import {VexRoom} from "@vex.dev/web-sdk";

interface MyVideoProps {
  room: VexRoom | undefined
  stream: MediaStream | undefined
}

interface MyVideoState {
  sendingVideo: boolean
  muted: boolean
}

export default class MyVideo extends React.Component<MyVideoProps, MyVideoState> {
  constructor(props:MyVideoProps) {
    super(props)
    this.state = { sendingVideo: false, muted: false }
    this.toggleSendingVideo = this.toggleSendingVideo.bind(this);
    this.toggleMuteSelf = this.toggleMuteSelf.bind(this);
  }

  toggleSendingVideo() {
    if (this.props.room && this.props.stream) {
      if (this.state.sendingVideo) {
        this.props.room.stopSendingMedia();
      } else {
        this.props.room.sendMedia(this.props.stream);
      }
      this.setState(state => {
        return { sendingVideo: !state.sendingVideo }
      })
    }
  }

  toggleMuteSelf() {
    if (this.props.room) {
      if (this.state.muted) {
        this.props.room.unmuteSelf();
      } else {
        this.props.room.muteSelf();
      }
      this.setState(state => {
        return { muted: !state.muted }
      })
    }
  }

  render() {
    return (
      <div className='my-video'>
        <div className='controls'>
          <button onClick={this.toggleSendingVideo}
            disabled={this.props.stream === null}>
            {this.state.sendingVideo ? "Stop Sending" : "Send"}
            &nbsp;Video
          </button>
          <button onClick={this.toggleMuteSelf}
            disabled={!this.state.sendingVideo}>
            {this.state.muted ? "Unmute" : "Mute"}
          </button>
        </div>
        {this.props.stream &&
          <Video stream={this.props.stream} />
        }
      </div>
    )
  }
}
