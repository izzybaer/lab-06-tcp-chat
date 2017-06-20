'use strict';

const Client = module.exports = function(socket) {
  this.nickName = `userName: ${Math.floor(Math.random() * (10 - 1)) + 1 }`;
  this.socket = socket;
};
