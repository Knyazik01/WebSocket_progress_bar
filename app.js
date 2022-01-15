const dotenv = require('dotenv');
dotenv.config();

const { ACTIONS, WEB_SOCKET_PORT } = require('./src/constants');

// const express = require("express");
// const app = express();
//
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
//
// const PORT = process.env.SERVER_PORT;
//
// app.listen(PORT, console.log(`Server started on port ${PORT}`));

// init websocket server
// ws
/*const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: WEB_SOCKET_PORT });*/

// socket.io
const app = require('express')();
const http = require('http').Server(app);
const wsServer = require('socket.io')(http);
const port = WEB_SOCKET_PORT;

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const main = () => {
  // init initial states
  const pregressBars = {};
  let userCount = 0;
  let curUserId;

  //
  const initProgressBar = (ms, getPrevVal, inc, callBack) => setInterval(() => {
    const prevVal = getPrevVal();
    const newVal = (prevVal + inc) < 100
      ? prevVal + inc
      : 100;
    callBack(newVal);
  }, ms);

  const onConnect = (wsClient) => {
    // init new user
    console.log('new user');
    let userInterval = null;
    curUserId = userCount;
    pregressBars[curUserId] = 0;

    // inc user count
    userCount += 1;


    // debugger logs
    console.log({ userCount, curUserId });
    console.log(pregressBars);
    //

    const callBackFunction = (newVal) => {
      // ws
      // wsClient.send(newVal);

      // socket.io
      wsServer.emit('back-end-progress', { data: newVal });

      pregressBars[curUserId] = newVal;
    };

    const getCurProgress = () => pregressBars[curUserId];

    // ws
    // const frontAction = 'message';

    // socket.io
    const frontAction = 'frontend-send-action';

    wsClient.on(frontAction, function (messageJSON) {
      // handle user message
      // ws
      // const message = JSON.parse(messageJSON);

      // socket.io
      const message = messageJSON;

      console.log(message);

      try {
        if (message.action === ACTIONS.STOP) {
          clearInterval(userInterval);
        }

        if (message.action === ACTIONS.START) {
          userInterval = initProgressBar(300, getCurProgress, 5, callBackFunction);
        }

        if (message.action === ACTIONS.RESTART) {
          clearInterval(userInterval);
          pregressBars[curUserId] = 0;
          userInterval = initProgressBar(300, getCurProgress, 5, callBackFunction);
        }
      } catch(e) {
        console.log(e);
        const error = 'Something went wrong';
        wsClient.send(error);
      }
    });

    // ws
    /*wsClient.on('close', function () {
      console.log('end session', curUserId);

      clearInterval(userInterval);
    });*/

    // socket.io
    wsClient.on("disconnect", () => {
      console.log('user disconnect', curUserId);

      clearInterval(userInterval);
    });
  }

  wsServer.on('connection', onConnect);

  wsServer.on('disconnect', () => {
    console.log('user disconnected', curUserId);
  });

  console.log('Server launched');
};

main();