const WebSocket=require('ws')

const numClients=10;

const clientPromises=[]
const createClient = (id) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:8020'); 
    ws.on('open', () => {
      console.log(`Client ${id} connected`);
      ws.send(`Hello from client ${id}`);
    });

    ws.on('message', (message) => {
      console.log(`Client ${id} received: ${message}`);
      resolve(`Client ${id} response: ${message}`); 
    });

    ws.on('error', (error) => {
      reject(`Client ${id} error: ${error}`);
    });

    ws.on('close', () => {
      console.log(`Client ${id} disconnected`);
    });
  });
};

for (let i = 1; i <= numClients; i++) {
  clientPromises.push(createClient(i));
}

Promise.all(clientPromises)
  .then((responses) => {
    console.log('All clients have received responses:');
    responses.forEach((response) => {
      console.log(response);
    });
  })
  .catch((error) => {
    console.error('Error with one of the clients:', error);
  });
