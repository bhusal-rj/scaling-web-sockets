const Redis=require('ioredis')
const WebSocketServer=require('ws').Server
const os=require("os")

const redisConfig={
  
  host:"redis",
  port:6379,
  db:0
}
const subscriber=new Redis(redisConfig)
const publisher=new Redis(redisConfig)
const wss=new WebSocketServer({port:8010})
//when the client is created subscribe to the channel called websocket
subscriber.subscribe('websocket',(err,count)=>{
  if (err){
    console.log("Failed to subscribe to the channel")
  }
else{
  console.log(`Subscribe to the channel`)    
  }
})

function broadcastMessage(message){
  wss.clients.forEach((client)=>{
    if(client.readyState==WebSocket.OPEN){
      client.send(message)
    }
  })
}

wss.on('connection',function(ws){
  const clientId=new Date().toISOString();
  ws.clientId=clientId;
  ws.on('message',function(message){
    console.log("Received from client: %s",message,clientId);
    publisher.publish('websocket',message + " received on host " + os.hostname)
  })

})

subscriber.on('message',(channel,message)=>{
  if(channel=="websocket"){
    console.log("Message has been received in" + os.hostname)
    broadcastMessage(message)
  }
})
