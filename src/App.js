import ProgressBar from './components/ProgressBar';
import styles from './App.module.scss';
import { useEffect, useState } from 'react';
import Button, { VIEWS } from './components/Button';
import { ACTIONS, WEB_SOCKET_PORT } from './constants';

const isDefined = (value) => (value !== null || value !== undefined);

const webSocket = new WebSocket(`ws://localhost:${WEB_SOCKET_PORT}`);

const wsSendMessage = (action, value) => {
  const requestData = { action };
  isDefined(value) && (requestData.data = value);
  const json = JSON.stringify(requestData);
  webSocket.send(json);
}

const App = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    /*
     function wsSendPing() {
     webSocket.send(JSON.stringify({action: 'PING'}));
     }*/

    webSocket.onopen = function () {
      console.log('connected');
    };

    webSocket.onmessage = function (message) {
      console.log(message.data);
      (+message.data) && setProgress(+message.data);
      (+message.data === 100) && wsSendMessage(ACTIONS.STOP);
    };

  }, []);
  
  const onButtonClick = (action) => {
    wsSendMessage(action);
    if (action === ACTIONS.START || action === ACTIONS.RESTART) {
      setIsLoading(true);
    } else if (action === ACTIONS.STOP) {
      setIsLoading(false);
    }
  }

  const startButtonText = isLoading
    ? 'Restart'
    : progress > 0 ? 'Resume' : 'Start';

  return (
    <div className={styles.app}>
      <p className={styles.title}>WebSocket progress bar</p>
      <ProgressBar progress={progress} />
      <div className={styles.buttonsBlock}>
        <Button
          onClick={() => onButtonClick(isLoading ? ACTIONS.RESTART : ACTIONS.START)}
        >
          {startButtonText}
        </Button>
        <Button
          view={VIEWS.RED}
          disabled={!isLoading || progress === 100}
          onClick={() => onButtonClick(ACTIONS.STOP)}
        >
          Stop
        </Button>
      </div>
    </div>
  );
};

export default App;
