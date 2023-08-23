import { useState, useEffect } from 'react';
import { openDB } from 'idb';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);
  const [musicFiles, setMusicFiles] = useState([]);

  const togglePlay = () => {
    if (audioInstance) {
      if (audioInstance.paused) {
        audioInstance.play();
      } else {
        audioInstance.pause();
      }
      setIsPlaying(!audioInstance.paused);
    }
  };

  const openMusicDatabase = async () => {
    return await openDB('musicDatabase', 1);
  };

  const storeFileInIndexedDB = async (fileData, fileName) => {
    const db = await openMusicDatabase();
    const transaction = db.transaction('musicStore', 'readwrite');
    const store = transaction.objectStore('musicStore');

    await store.put(fileData, fileName);
  };

  const loadFilesFromIndexedDB = async () => {
    const db = await openMusicDatabase();
    const transaction = db.transaction('musicStore', 'readonly');
    const store = transaction.objectStore('musicStore');
    return await store.getAll();
  };

  const decodeAudioData = async (audioContext, arrayBuffer) => {
    return new Promise((resolve, reject) => {
      audioContext.decodeAudioData(arrayBuffer, resolve, reject);
    });
  };

  const loadMusicFiles = async () => {
    const files = await loadFilesFromIndexedDB();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Decodificar los ArrayBuffer en objetos de audio
    const audioPromises = files.map(async (file) => {
      const audioBuffer = await decodeAudioData(audioContext, file);
      return new Audio(URL.createObjectURL(new Blob([audioBuffer])));
    });
  
    // Esperar a que se completen todas las promesas
    Promise.all(audioPromises)
      .then((audioInstances) => {
        setMusicFiles(audioInstances);
      })
      .catch((error) => {
        console.error('Error al decodificar audio:', error);
      });
  };
  
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    try {
      // Almacenar cada archivo en IndexedDB en transacciones separadas
      for (const file of selectedFiles) {
        try {
          const fileData = await file.arrayBuffer();
          await storeFileInIndexedDB(fileData, file.name);
        } catch (error) {
          console.error('Error al almacenar archivo en IndexedDB:', error);
        }
      }

      // Actualizar la lista de archivos después de completar todas las transacciones
      loadMusicFiles();
    } catch (error) {
      console.error('Error en la transacción IndexedDB:', error);
    }
  };

  useEffect(() => {
    const loadMusicFromIndexedDB = async () => {
      await openDB('musicDatabase', 1, {
        upgrade(db) {
          db.createObjectStore('musicStore');
        },
      });

      loadMusicFiles()

      const allFiles = await loadFilesFromIndexedDB();
        // Create an instance of Audio for the first music file
        if (allFiles.length > 0) {
          const audio = new Audio(URL.createObjectURL(new Blob([allFiles[0]])));
          setAudioInstance(audio);
        }
    };

    loadMusicFromIndexedDB();

    
  }, []);

  console.log(musicFiles[0]);

  return (
    <div>
      <h2>Reproductor de Audio</h2>
      <input type="file" multiple onChange={handleFileChange} />
      {/* {musicFiles.map((fileName, index) => (
        <div key={index}>{fileName}</div>
      ))} */}
     <button onClick={togglePlay}>
        {isPlaying ? 'Pausar' : 'Reproducir'}
      </button>
    </div>
  );
};

export default Player;
