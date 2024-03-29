import React, { useRef, useEffect, useState } from 'react';
import Notification from '@/wrapComponent/Notification';
import Cookies from 'js-cookie';
import Loading from '../../wrapComponent/Loading';
import Modal from './component/modal';
import { useDidMount } from '../../utils/hooks';
import { getCache, setCache, hasChange, qqSign } from '@/utils/functions';
import { queryFriends } from './service';
import { init, setStyle } from './util';
import Site from './component/site';
import styles from './index.less';

export default () => {
  const ref = useRef({});
  const cacheData = getCache('friends') || [];
  const [data, setData] = useState(cacheData);
  const [modalVidible, setVisible] = useState(false);
  useEffect(() => {
    if (ref.current) {
      init(ref.current);
    }
  }, [ref]);
  useDidMount(async () => {
    try {
      if (!cacheData.length) Loading.show();
      const result = await queryFriends();
      if (result.success) {
        const { data: res } = result;
        setData(res || []);
        if (hasChange(cacheData, res)) setCache('friends', res);
      }
    } catch (error) {
    } finally {
      Loading.hide();
    }
  });
  const turn2Page = (link) => {
    if (!link) return;
    let url = link;
    if (!/^https:\/\/+|^http:\/\//.test(link)) {
      url = 'https://' + url;
    }
    window.open(`${url}?from=adaxh.site`);
  };
  const onRequire = () => {
    if (!Cookies.get('token')) {
      Notification.fail({
        msg: (
          <div className={styles.tipCon}>
            <div>登录才能提交</div>
            <div>
              <span>还没有账号？</span>
              <a onClick={qqSign}>点击使用QQ，1秒快捷登录！</a>
            </div>
          </div>
        ),
        duration: 5,
      });
    } else {
      setVisible(true);
    }
  };
  return (
    <div className={styles.another}>
      <Site />
      <Modal visible={modalVidible} setVisible={() => setVisible(false)} />
      <div className={styles.ref} ref={ref}>
        <div data-depth="0.6" className={`layer ${styles.layer}`}>
          <div className={styles.someSpace} />
        </div>
        <div data-depth="0.4" className={`layer ${styles.layer}`}>
          <div className={styles.content}>
            <h4 className={styles.fTitle}>
              期待新的友情，排名不分前后......{' '}
              <a onClick={onRequire}>申请加链</a>
            </h4>
            <div className={styles.itemF}>
              {data
                .filter((item) => item.verify)
                .map(({ link, desc, title, icon }, index) => {
                  return (
                    <a
                      className={styles.friendItem}
                      key={link}
                      style={setStyle(index)}
                      onClick={() => turn2Page(link)}
                    >
                      <div className={styles.avatar}>
                        <img src={icon} alt="icon" />
                      </div>
                      <div className={styles.view}>
                        <div className={styles.title}>{title}</div>
                        <div className={styles.desc}>{desc}</div>
                      </div>
                      <div className={styles.effectLineBottom} />
                      <div className={styles.effectLineRight} />
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
