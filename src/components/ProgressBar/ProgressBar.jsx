import styles from './ProgressBar.module.scss';

const ProgressBar = ({ progress }) => (
  <div className={styles.progressBar}>
    <p className={styles.progressPercent}>{progress} %</p>
    <div className={styles.progressBarProgress} style={{ width: `${progress}%` }} />
  </div>
);

export default ProgressBar;