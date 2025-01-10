import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let allSockets = new Map<string, WebSocket[]>();

function findRoom(socket: WebSocket): string | undefined {
  for (const [roomId, sockets] of allSockets) {
    if (sockets.includes(socket)) {
      return roomId;
    }
  }

  return undefined;
}

wss.on("connection", function (socket) {
  console.log("user connected");

  socket.on("message", (e) => {
    const parsedMessage = JSON.parse(e.toString());

    if (parsedMessage.type === "join") {
      const sockets = allSockets.get(parsedMessage.payload.roomId) || [];
      allSockets.set(parsedMessage.payload.roomId, [...sockets, socket]);
      console.log("joined", e.toString());
    }

    if (parsedMessage.type === "chat") {
      const roomId = findRoom(socket);
      if (roomId) {
        const sockets = allSockets.get(roomId);

        sockets?.forEach((c) => {
          if (c !== socket) {
            c.send(parsedMessage.payload.message);
          }
        });
        console.log("sent");
      }

      console.log("room does not exist ");
    }
  });

  socket.on("close", () => {
    const roomId = findRoom(socket);
    if (roomId) {
      const sockets = allSockets.get(roomId) || [];
      const updatedSockets = sockets.filter((s) => s !== socket);
      allSockets.set(roomId, updatedSockets);
      console.log("socket closed in case of room ");
    }
  });
});
