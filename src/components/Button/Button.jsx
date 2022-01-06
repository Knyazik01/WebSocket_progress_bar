import classNames from 'classnames';
import styles from './Button.module.scss';

export const VIEWS = {
  BLUE: styles.blue,
  RED: styles.red,
  DEFAULT: '',
};

const Button = ({
  children,
  className,
  onClick,
  type = 'button',
  view = VIEWS.BLUE,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(styles.button, view, className)}
    >
      {children}
    </button>
  );
};

export default Button;