import { useState } from 'react';
import classnames from 'classnames';
import { useDidMount } from '@/util/hooks';
import { getCache, setCache } from '@/util/functions';
import Repeat from './repeat';
import { queryMessage } from './service';
import { setStyle } from './util';

import styles from './index.less';

export default ({ theme }) => {
  const cacheData = getCache('messages') || [];
  const [data, setData] = useState(cacheData);
  useDidMount(async () => {
    const { success, data: res } = (await queryMessage()) || {};
    if (success) {
      if (cacheData) {
        if (JSON.stringify(cacheData) !== JSON.stringify(res)) {
          setCache('messages', res);
          setData(res);
        }
      } else {
        setData(res);
      }
    }
  });
  const toggleMsg = _id => {
    data.forEach(item => {
      if (item._id === _id) {
        item.toggle = !item.toggle;
      }
    });
    setData([...data]);
  };
  const cla = classnames({
    [styles[theme]]: true,
    [styles.itemF]: true,
  });
  return (
    <div className={cla}>
      <a className={styles.friendItem}>
        <div className={styles.view}>
          <div className={styles.title}>留言板</div>
        </div>
      </a>
      {data.map(({ _id, avatar, content, name, repeat, date, toggle }, index) => {
        return (
          <div className={styles.friendItem} key={_id} style={setStyle(index)}>
            <div className={styles.avatar}>
              <img src={avatar} alt="icon" />
            </div>
            <div className={styles.view}>
              <div className={styles.title}>
                {name}: <span className={styles.date}>{date && date.replace(/-----/, '')}</span>
              </div>
              <div className={styles.desc}>
                {content}
                <span onClick={() => toggleMsg(_id)}>
                  <svg className="icon" aria-hidden="true">
                    <use href="#icon-message"></use>
                  </svg>
                  {repeat.length}
                </span>
              </div>
            </div>
            {toggle && repeat && <Repeat repeat={repeat} />}
          </div>
        );
      })}
    </div>
  );
};
