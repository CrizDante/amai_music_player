import { openDB } from 'idb';
import { Component } from 'react'
// import { Howl, Howler } from "howler";
// const themeNow = new Howl()



export default class Player extends Component {

  constructor(props) {
    super(props)
    this.state = {
      biblioteca: [],
      lista: [

      ],
      player: new Audio(),
    }
  }

  handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);

    filesArray.forEach((file) => {
      this.initBiblio(file);
    });
  };

  initBiblio = async (file) => {
    const db = await openDB('musicaDB', 1)
    const transaccion = db.transaction('musica', 'readwrite')
    const objectStore = transaccion.objectStore('musica')

    const musica = { file }
    await objectStore.add(musica)

    console.log('Archivo de música almacenado exitosamente');
  };

  initPLayer = () => {

  }

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
