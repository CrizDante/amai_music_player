/* eslint-disable react-refresh/only-export-components */
import { openDB } from 'idb';
import { Component } from 'react'
// import { Howl, Howler } from "howler";
// const themeNow = new Howl()


const DB = await openDB('musicaDB', 1, {
  upgrade(db) {
    // Create a store of objects
    db.createObjectStore('musica', {
      // The 'id' property of the object will be the key.
      keyPath: 'id',
      // If it isn't explicitly set, create a value by auto incrementing.
      autoIncrement: true,
    });
  },
})


export default class Player extends Component {

  constructor(props) {
    super(props)
    this.state = {
      permission: false,
      biblioteca: [],
      lista: [

      ],
      player: new Audio(),
      db: DB     
    }
    this.searchPermissions = this.searchPermissions.bind(this)
    this.getBiblio = this.getBiblio.bind(this)
  }

  searchPermissions = async () => {
    const granted = await document.hasStorageAccess();
    console.log(granted);

    if (granted) {
      this.setState({ permission: true })
    } else {
      document.requestStorageAccess()
    }
  }

  getBiblio = async () => {

    const {db} = this.state

    console.log(await db.getAllFromIndex('musica', 'id'));
    // this.setState({ biblioteca: newBiblio });
  };

  handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);

    filesArray.forEach((file, index) => {
      this.initBiblio(file, index);
    });
  };

  initBiblio = async (file) => {
    const {db} = this.state

    const item = db.transaction('musica', 'readwrite')

    await item.store(file)
  };


  render() {
    const { player, biblioteca } = this.state

    console.log(biblioteca, player);
    return (
      <div>

        <input type="file" multiple onChange={this.handleFileChange} />

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
