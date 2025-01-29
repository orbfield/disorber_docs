export class StreamManager {
  constructor(BinaryStream) {
    this.BinaryStream = BinaryStream;
    this.maxStreams = 42;
    this.lineLength = 160;
  }

  setMaxStreams(value) {
    this.maxStreams = value;
  }

  setLineLength(value) {
    this.lineLength = value;
  }

  getMaxStreams() {
    return this.maxStreams;
  }

  getLineLength() {
    return this.lineLength;
  }

  createStream(key, speed) {
    return new this.BinaryStream(key, speed);
  }

  addStream(streams, key, speed) {
    if (key < 1 || key > 20) return streams;

    const newStream = this.createStream(key, speed);
    
    if (streams.length < this.maxStreams) {
      return [...streams, newStream];
    }
    
    return [...streams.slice(1), newStream];
  }

  updateStreamsSpeeds(streams, newSpeed) {
    // Update speeds and trigger re-render for CSS animation update
    return streams.map(stream => {
      stream.speed = newSpeed;
      return { ...stream }; // Create new reference to trigger re-render
    });
  }
}
