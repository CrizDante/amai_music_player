export default class AudioFile {
  constructor(audioContext, path) {
    this.audioContext = audioContext;
    this.path = path;
    this.buffer = null;
    this.loaded = false;
  }

  load() {
    const request = new Request(this.path);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      this.buffer = request.response;
      this.loaded = true;
      this.dispatchEvent(new Event('loadedmetadata'));
    };

    request.onerror = (error) => {
      console.error('Error al cargar archivo de audio:', error);
    };

    fetch(request);
  }

  getTitle() {
    const title = this.buffer.metadata.title;
    return title || '';
  }

  getArtist() {
    const artist = this.buffer.metadata.artist;
    return artist || '';
  }

  getAlbum() {
    const album = this.buffer.metadata.album;
    return album || '';
  }

  getYear() {
    const year = this.buffer.metadata.year;
    return year || '';
  }

  getTrackNumber() {
    const trackNumber = this.buffer.metadata.trackNumber;
    return trackNumber || '';
  }

  getGenre() {
    const genre = this.buffer.metadata.genre;
    return genre || '';
  }

  getDuration() {
    const duration = this.buffer.duration;
    return duration || 0;
  }
}