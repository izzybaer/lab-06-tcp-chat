'use strict';

const User = module.exports = function(socket) {
  this.nickName = `user_${Math.random()}`;
  this.socket = socket;
};
