import { useEffect, useRef, useState } from "react";

function App() {
  const socketref = useRef<WebSocket | null>(null);
  const inputref = useRef<HTMLInputElement | null>(null);
  const joinref = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState([""]);
  const [sent, setSent] = useState([""]);

  function joinRoom() {
    if (!socketref.current) {
      return;
    }

    if (!joinref.current?.value) {
      return;
    }

    const obj = JSON.stringify({
      type: "join",
      payload: {
        roomId: joinref.current.value,
      },
    });
    socketref.current.send(obj);
    joinref.current.value = "";
  }

  function sendMessage() {
    if (!socketref.current) {
      return;
    }

    if (!inputref.current?.value) {
      return;
    } else {
      const obj = JSON.stringify({
        type: "chat",
        payload: { message: inputref.current.value },
      });

      socketref.current.send(obj);
      setSent((prev) => {
        return [...prev, inputref.current!.value];
      });
      setTimeout(() => {
        inputref.current!.value = "";
      }, 500);
    }
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    socketref.current = ws;

    ws.onmessage = (e) => {
      console.log(typeof e.data);
      console.log(e.data);

      setMessage((prev) => {
        return [...prev, e.data];
      });

      // alert(e.data);
    };

    return () => {
      socketref.current = null;
      ws.close();
    };
  }, []);
  return (
    <>
      <div>
        <input ref={joinref} type="text" placeholder="RoomID"></input>
        <button onClick={joinRoom}>Join room</button>
        <input ref={inputref} type="text" placeholder="Message"></input>
        <button onClick={sendMessage}>Send</button>
        <div style={{ display: "flex", gap: "50px", alignItems: "flex-start" }}>
          <div
            style={{
              backgroundColor: "gray",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {" "}
            <span>Recieved</span>
            {message.map((m, index) => (
              <div key={index}>{m}</div>
            ))}
          </div>
          <div
            style={{
              backgroundColor: "pink",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Sent</span>
            {sent.map((m, index) => (
              <div key={index}>{m}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
