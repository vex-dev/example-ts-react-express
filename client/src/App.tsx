import React from 'react';
import './App.css';
import {Vex, VexConnection} from '@vex.dev/web-sdk';
import VideoRoom from './VideoRoom';

interface AppProps {
}

interface AppState {
  connectionStatus: string;
  vexInstance?: Vex
  conn?: any,
  roomId: string
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      connectionStatus: "disconnected",
      roomId: window.vex_room_id
    };
  }

  componentDidMount() {
    this.connectToVex();
  }

  connectToVex() {
    const vex = new Vex({
      url: 'wss://app.vex.dev',
      onDisconnect: () => {
        this.onVexDisconnect()
      }
    });
    this.setState({vexInstance: vex, connectionStatus: "connecting..."});
    vex.connect().then(conn => {
      this.onVexConnect(conn)
    });
  }

  onVexConnect(conn: VexConnection) {
    this.setState({connectionStatus: "connected", conn})
  }

  onVexDisconnect() {
    this.setState({connectionStatus: "disconnected"})
  }

  render() {
    return (
      <div className='video-app'>
        <p>Vex: {this.state.connectionStatus}</p>
        {this.state.connectionStatus === "connected" &&
        <VideoRoom roomId={this.state.roomId}
                   // @ts-ignore
                   vex={this.state.vexInstance}
                   conn={this.state.conn}/>
        }
      </div>
    )
  }
}

export default App;
