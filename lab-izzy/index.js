'use strict';

const net = require('net');
const server = net.createServer();
const User = require('./user.js');

let clientPool = [];

server.on('connection', (socket) => {
  let user = new User(socket);
  socket.write(`hello ${user.nickName}, welcome to codeChat!\n`);
  console.log(`${user.nickName} is connected!`);

  clientPool = [...clientPool, user];


  let handleDisconnect = () => {
    console.log(`${user.nickName} has left the chat`);
    clientPool = clientPool.filter(item => item !== user);
  };

  let handleError = (error) => {
    console.log('There is an error, you are being disconnected.');
    console.log(error);
    clientPool = clientPool.filter(item => item !== user);
  };

  socket.on('error', handleError);
  socket.on('close', handleDisconnect);

  socket.on('data', (buffer) => {
    let data = buffer.toString();

    //this allows the user to change their nickname
    if(data.startsWith('/nick')) {
      user.nickName = data.split('/nick ')[1] || user.nickName;
      user.nickName = user.nickName.trim();
      socket.write(`from henceforth, you shall be called ${user.nickName}`);
      console.log('data');
      return;
    }

    //this allows the user to send a direct message to another user
    if(data.startsWith('/dm')) {
      let userName = data.split(' ')[1];
      let matchedUsers = clientPool.filter(item => item.nickName === userName);
      matchedUsers.forEach((dmUser) => {
        let message = data.split(' ').slice(2).join(' ');
        dmUser.socket.write(`${user.nickName}: ${message}`);
      });
      return;
    }

    //this takes in a number and a message and sends the message to everyone that many times
    if(data.startsWith('/troll')) {
      let inputNumber = data.split('/troll ')[1].slice(0, 1);
      let content = data.split('/troll').slice(2).join(' ');
      console.log(inputNumber);
      for (var i = 0; i < inputNumber; i++) {
        clientPool.forEach((user) => {
          user.socket.write(`${user.nickName}: ${content}\n`);
        });
      }
      return;
    }

    //this prints a users nickname when a user types, if they don't type in /nickname. this is the default.
    clientPool.forEach((item) => {
      item.write(`${user.nickName}: ${data}`);
    });

    if(data.startsWith('/quit')){
      user.socket.handleDisconnect();
      user.socket.end();
    }
  });
});

server.listen(3000, () => {
  console.log('servin up some peaky blinderz on port 3000');
});
