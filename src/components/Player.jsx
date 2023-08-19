import { openDB } from 'idb';
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

    openDB('musicaDB', 1, {
      upgrade(db) {
        db.createObjectStore('musica')
      }
    })
  }

  getBiblio = async()=>{
    const db = await openDB('musicaDB', 1)
    const newBiblio = await db.getAll()
    this.setState({biblioteca: newBiblio})
  }

  handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);

    filesArray.forEach((file, index) => {
      this.initBiblio(file, index);
    });
  };

  initBiblio = async (file, id) => {

    const db = await openDB('musicaDB', 1)
    const musica = { file }
    await db.add('musica', musica, `${id}`)
    console.log('Archivo de música almacenado exitosamente');
  };


  render() {
    const { player, biblioteca } = this.state

    console.log(biblioteca[0], player);
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
