// import { openDB } from 'idb';
import { Component } from 'react'
// import { Howl, Howler } from "howler";
// const themeNow = new Howl()



export default class Player extends Component {

  constructor(props) {
    super(props)
    this.state = {
      permission: false,
      biblioteca: [],
      lista: [

      ],
      player: new Audio(),
    }
    this.RetrieveMusicFiles = this.RetrieveMusicFiles.bind(this)
    this.getBiblio = this.getBiblio.bind(this)
  }

  RetrieveMusicFiles = async () => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(['music'], 'readonly');
      const objectStore = transaction.objectStore('music');
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const files = event.target.result;
        this.setState({ biblioteca: files })
      };
    } catch (error) {
      console.error('Error retrieving music files:', error);
    }
  };

  handleFileUpload = async (event) => {
    const files = event.target.files;

    try {
      const db = await openDatabase();
      const transaction = db.transaction(['music'], 'readwrite');
      const objectStore = transaction.objectStore('music');

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const request = objectStore.add(file);

        request.onsuccess = () => {
          console.log('File added to IndexedDB:', file.name);
        };

        request.onerror = (event) => {
          console.error('Error adding file to IndexedDB:', event.target.error);
        };
      }

      this.setState({ biblioteca: [...this.state.biblioteca, ...files] })
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  OpenDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('MusicDatabase', 1);

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('music', { keyPath: 'name' });
      };
    });
  };

  render() {
    const { player, biblioteca } = this.state

    console.log(biblioteca, player);
    return (
      <div>

        <input type="file" multiple onChange={this.handleFileUpload} />

        <button onClick={() => {
          // honk.currentTime=0
          player.play()
        }}>
          ▶
        </button>
        <audio src=""></audio>
        <button onClick={() => {
          player.pause()
        }}>
          ⏸
        </button>
        <h3>{ }</h3>
      </div>
    )
  }
}
