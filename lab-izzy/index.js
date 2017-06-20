'use strict';

const net = require('net');
const server = net.createServer();
const Client = require('./client.js');

let clientPool = [];

server.on('connection', (socket) => {
  let client = new Client(socket);
  socket.write(`hello ${client.nickName}, welcome to codeChat!\n`);
  console.log(`${client.nickName} is connected!`);

  clientPool = [...clientPool, client];


  let handleDisconnect = () => {
    console.log(`${client.nickName} has left the chat`);
    clientPool = clientPool.filter(item => item !== client);
  };

  let handleError = (error) => {
    console.log('There is an error, you are being disconnected.');
    console.log(error);
    clientPool = clientPool.filter(item => item !== client);
  };

  socket.on('error', handleError);
  socket.on('close', handleDisconnect);

  socket.on('data', (buffer) => {
    let data = buffer.toString();

    //this allows the client to change their nickname
    if(data.startsWith('/nick')) {
      client.nickName = data.split('/nick ')[1] || client.nickName;
      client.nickName = client.nickName.trim();
      socket.write(`from henceforth, you shall be called ${client.nickName}`);
      return;
    }

    //this allows the client to send a direct message to another client
    if(data.startsWith('/dm')) {
      let userName = data.split(' ')[1];
      let matchedUsers = clientPool.filter(item => item.nickName === userName);
      matchedUsers.forEach((dmUser) => {
        let message = data.split(' ').slice(2).join(' ');
        dmUser.socket.write(`${client.nickName}: ${message}`);
      });
      return;
    }

    //this takes in a number and a message and sends the message to everyone that many times
    if(data.startsWith('/troll')) {
      let inputNumber = data.split('/troll ')[1].slice(0, 1);
      let content = data.split('/troll').slice(2).join(' ');
      for (var i = 0; i < inputNumber; i++) {
        clientPool.forEach((client) => {
          client.socket.write(`${client.nickName}: ${content}\n`);
        });
      }
      return;
    }

    if(data.startsWith('/quit')){
      clientPool.forEach((client) => {
        client.socket.write(`\n${client.nickname} has quit!`);
      });
      client.socket.end();
      return;
    }

    //this prints a clients nickname when a client types, if they don't type in /nickname. this is the default.
    clientPool.forEach((item) => {
      item.write(`${client.nickName}: ${data}`);
    });
  });
});

server.listen(3000, () => {
  console.log('servin up some peaky blinderz on port 3000');
});
