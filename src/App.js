import { useEffect, useRef, useState } from "react";
import "./App.css";

import NavBar from "./Component/NavBar";
import Spreadsheet from "./Component/Spreadsheet";
// import io from 'socket.io-client';


const defaultCellProperties = {
    bold: false,
    italic: false,
    linethrough: false,
    fontFamily: "Arial",
    fontSize: 14,
    halign: "left",
    value: "",
    children: [],
    formula: "",
    fontColor: {
      r: "0",
      g: "0",
      b: "0",
      a: "1",
    },
    cellColor: "",
  };
function App() {
  const [currCell, setCurrcell] = useState("A1");
  
  // Initialize state to store cell values
  const [cells, setCells] = useState(() => {
    const initialCells = {};
    // Initialize cells with empty strings
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 26; j++) {
        const cellId = `${String.fromCharCode(65 + j)}${i + 1}`;
        initialCells[cellId] = {...defaultCellProperties};
      }
    }
    return initialCells;
  });


  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   const newSocket = io("http://localhost:8000");
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   if(!socket) return;
  //   // Listen for cell updates from server
  //   socket.on('cell-update', (data) => {
  //     setCells((prevCells) => ({
  //       ...prevCells,
  //       [data.cellId]: {
  //         ...prevCells[data.cellId],
  //         [data.property]: data.value,
  //       },
  //     }));
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);

  const handleCellPropertyChange = (cellId, property, value) => {
    // if(!socket) return;
    // socket.emit('cell-update', { cellId, property, value });

    setCells((prevCells) => ({
      ...prevCells,
      [cellId]: {
        ...prevCells[cellId],
        [property]: value,
      },
    }));
  };
  return (
    <>
      <NavBar cells={cells} handleCellPropertyChange={handleCellPropertyChange} currCell={currCell} setCurrcell={setCurrcell} setCells={setCells}/>
      <Spreadsheet cells={cells} handleCellPropertyChange={handleCellPropertyChange} currCell={currCell} setCurrcell={setCurrcell}/>
    </>
  );
}

export default App;
