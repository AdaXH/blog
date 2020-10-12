import { relativetime } from './util';
import styles from './index.less';

export default ({ repeat }) => {
  if (!repeat.length) return null;
  return (
    <div className={styles.repeat}>
      {repeat.map(({ name, toRepeatUser, info, date, _id }) => (
        <div key={_id} className={styles.repeatItem}>
          <div className={styles.repeatTitle}>
            {name} {relativetime(date)} @ {toRepeatUser && toRepeatUser.name}:
          </div>
          <div className={styles.repeatInfo}>{info}</div>
        </div>
      ))}
    </div>
  );
};
