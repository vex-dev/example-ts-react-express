import React, {RefObject} from 'react';

interface VideoProps {
  stream: MediaStream
}

export default class Video extends React.Component<VideoProps> {
  myRef: RefObject<any>

  constructor(props: VideoProps) {
    super(props)
    this.myRef = React.createRef<HTMLDivElement>()
  }

  componentDidMount() {
    const node = this.myRef.current
    node.srcObject = this.props.stream
  }

  render() {
    return (
      <video
        ref={this.myRef}
        autoPlay
        playsInline
        controls
      />
    )
  }
}
