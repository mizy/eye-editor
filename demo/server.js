const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log("connected")
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.send('连接成功！');
});