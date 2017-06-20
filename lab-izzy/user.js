'use strict';

const User = module.exports = function(socket) {
  this.nickName = `userName: ${Math.floor(Math.random() * (10 - 1)) + 1 }`;
  this.socket = socket;
};
