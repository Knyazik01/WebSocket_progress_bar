const ACTIONS = {
  START: 'START',
  STOP: 'STOP',
  RESTART: 'RESTART',
}

const SERVER_PORT = +process.env.REACT_APP_SERVER_PORT;
const WEB_SOCKET_PORT = +process.env.REACT_APP_WEB_SOCKETS_POST;

module.exports = {
  ACTIONS,
  SERVER_PORT,
  WEB_SOCKET_PORT,
};