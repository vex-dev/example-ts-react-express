import React from 'react';
import Video from './Video';
import {Vex, VexConnection, VexRoom, Peer} from "@vex.dev/web-sdk";
import MyVideo from "./MyVideo";

type PeerInfo = {
  peer: Peer
  stream: MediaStream
}

type PeersMap = {
  [key: string]: PeerInfo
}

interface VideoRoomProps {
  vex: Vex
  roomId: string
  conn: VexConnection
}

interface VideoRoomState {
  joinStatus: string
  vexRoom?: VexRoom
  peersInRoom: PeersMap
  sendingVideo: boolean
  myVideoStream?: MediaStream
}

export default class VideoRoom extends React.Component<VideoRoomProps, VideoRoomState> {
  constructor(props: VideoRoomProps) {
    super(props)
    this.state = {
      joinStatus: "unjoined",
      peersInRoom: {},
      sendingVideo: false
    }
  }

  async componentDidMount() {
    this.joinVexRoom(this.props.roomId);
    this.getMyVideoStream();
  }

  joinVexRoom(roomId: string) {
    const jwt = window.vex_jwt;

    this.setState({joinStatus: "joining..."})
    const vexRoomConfig = {
      displayName: "React Example",
      onPeerJoined: this.onPeerJoined,
      onPeerMedia: (peer: Peer, stream: MediaStream) => {
        this.onPeerMedia(peer, stream)
      },
      onPeerLeft: (peer: Peer) => {
        this.onPeerLeft(peer)
      }
    }
    this.props.conn.joinRoom(roomId, jwt, vexRoomConfig)
      .then((vexRoom: VexRoom) => {
        this.setState({joinStatus: "succeeded", vexRoom})
      })
      .catch(error => {
        this.setState({joinStatus: "failed"});
      })
  }

  getMyVideoStream() {
    this.props.vex.getMedia({
      audio: true,
      video: {
        width: {min: 640, ideal: 1920, max: 1920},
        height: {min: 400, ideal: 1080}
      }
    }).then(myVideoStream => {
      this.setState({myVideoStream});
    })
  }

  onPeerJoined(this: VexRoom, peer: Peer) {
    // WARNING: onPeerJoined can be called before the Promise returned by joinRoom resolves.
    this.receiveMediaFrom(peer.id);
  }

  onPeerMedia(this: VideoRoom, peer: Peer, stream: MediaStream) {
    this.setPeerState({peer, stream})
  }

  onPeerLeft(this: VideoRoom, peer: Peer) {
    this.setState((state, props) => {
      const peersInRoom = state.peersInRoom
      delete peersInRoom[peer.id]
      return {peersInRoom}
    });
  }

  setPeerState(peerState: PeerInfo) {
    this.setState((state, props) => {
      const peersInRoom = state.peersInRoom
      peersInRoom[peerState.peer.id] = peerState
      return {peersInRoom}
    });
  }

  render() {
    return (
      <div className='video-room'>
        <div className='room-info'>
          <p>Room {this.props.roomId}</p>
          <p>Join: {this.state.joinStatus}</p>
        </div>
        <div className='spacer'/>
        <VideoGrid peers={this.state.peersInRoom}/>
      </div>
    )
  }
}

function VideoGrid(props: { peers: PeersMap }) {
  return (
    <div className='video-grid'>
      {Object.values(props.peers).map(peerInfo =>
        <VideoGridSquare key={peerInfo.peer.id}
                         stream={peerInfo.stream}
                         name={peerInfo.peer.displayName}/>
      )}
    </div>
  )
}

function VideoGridSquare(props: {
  key: string
  stream: MediaStream
  name: string
}) {
  return (
    <div className='peer-video'>
      <Video stream={props.stream}/>
      <p className='peer-name'>{props.name}</p>
    </div>
  )
}
