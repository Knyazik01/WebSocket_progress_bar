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


const main = () => {
  const WebSocket = require('ws');

  // init websocket server
  const wsServer = new WebSocket.Server({ port: WEB_SOCKET_PORT });

  // init initial states
  const pregressBars = {};
  let userCount = 0;

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
    const curUserId = userCount;
    pregressBars[curUserId] = 0;

    // inc user count
    userCount += 1;


    // debugger logs
    console.log({ userCount, curUserId });
    console.log(pregressBars);
    //

    const callBackFunction = (newVal) => {
      wsClient.send(newVal);
      pregressBars[curUserId] = newVal;
    };

    const getCurProgress = () => pregressBars[curUserId];

    wsClient.on('message', function (messageJSON) {
      // handle user message
      const message = JSON.parse(messageJSON);
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

    wsClient.on('close', function () {
      console.log('end session', curUserId);

      clearInterval(userInterval);
    });
  }

  wsServer.on('connection', onConnect);

  console.log('Server launched');
};

main();