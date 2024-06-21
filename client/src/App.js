import "./App.css";
import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";

function App() {
  const [file, setFile] = useState();
  const [socket, setSocket] = useState(null);
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  useEffect(() => {
    const socketConnection = io(
      "localhost:3000/USER-6530de443e4ea119cf5aa1a8",
      {
        auth: {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiNjUzMGRlNDQzZTRlYTExOWNmNWFhMWE4IiwiZGVwYXJ0bWVudCI6IkRldmVsb3BtZW50IFRlYW0ifSwiaWF0IjoxNjk4MDU0MTM2LCJleHAiOjE3MDA3MzI1MzZ9.yELT9CwH4sar4FBgWfxwZDXe1_kUd4W8YCy4K3_0sy0",
        },
      }
    );
    setSocket(socketConnection);
  }, []);

  socket &&
    socket.on("file_uploaded", (data) => {
      console.log("data from server: ", data);
    });

  function sendFile() {
    if (file) {
      const reader = new FileReader();
      const chunkSize = file.size / 25;
      reader.onload = (e) => {
        const fileBuffer = e.target.result;
        let offset = 0;

        function sendChunk() {
          console.log("offset: ", offset);
          console.log("chunkSize: ", chunkSize);
          console.log("fileSize: ", fileBuffer.byteLength);
          const chunk = fileBuffer.slice(offset, offset + chunkSize);
          //console.log(chunk);
          socket.emit("file_chunk", chunk);
          offset += chunkSize;
          if (offset < fileBuffer.byteLength) {
            sendChunk();
          } else {
            socket.emit("file_sent");
            setFile(null);
            console.log("File sent");
          }
        }

        sendChunk();
      };

      reader.readAsArrayBuffer(file);
    }
  }

  socket &&
    socket.on("send_the_file", () => {
      sendFile();
    });

  function handleSubmit(event) {
    event.preventDefault();
    console.log(file);

    //socket.emit('test_event')

    if (file) {
      const data = socket.emit("start_data_send", {
        name: file.name,
        size: file.size,
      });
    }
  }

  return (
    <div className="App">
      <form>
        <h1>React File Upload</h1>
        <input type="file" onChange={handleChange} />
        <button type="submit" onClick={handleSubmit}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default App;
