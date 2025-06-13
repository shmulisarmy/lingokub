// server.js
const next = require('next');
const http = require('http');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler(); // handles all Next.js routing



console.log("hey there")



const ws_state = {
  clients: [],
  messages: [],
  broadcast: (message) => {
    ws_state.clients.forEach((client) => {
      client.send(message);
    });
  },
  send_all: (client) => {
    console.log("sending_all");
    console.log("messages: ", ws_state.messages);
    
    ws_state.messages.forEach((message) => {
      client.send(message);
    });
  },
  join_ws: (client) => {
    ws_state.clients.push(client);
    ws_state.send_all(client);
  },
}



app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res); // forward all HTTP requests to Next.js
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/ws') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
      // ws_state.join_ws(socket);
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    ws.send('Hello from custom WebSocket server!');
    // console.log(JSON.stringify(ws))
    ws_state.join_ws(ws);
    ws.on('message', (msg) => {
      console.log(`received message: ${msg}`); // console.log(JSON.stringify(msg.toString()));
      
      ws_state.messages.push(msg.toString());
      ws_state.broadcast(msg.toString());
    });
  });


  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
