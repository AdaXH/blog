import { useRef, useEffect, useState } from 'react';
import Loading from '@/component/load';
// import { MAP_TITLE } from './constant';
import styles from './index.less';
export default ({
  history: {
    location: {
      query: { src, type },
    },
  },
}) => {
  const ref = useRef();
  const [layVisible, setVisible] = useState(true);
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.onload = (e) => {
        setVisible(false);
      };
    }
  }, [ref, src]);
  return (
    <div className={styles.iframe}>
      {layVisible && (
        <div className={styles.overLay}>
          <Loading />
        </div>
      )}
      <iframe ref={ref} src={decodeURIComponent(src)} title="ada" allowFullScreen></iframe>
    </div>
  );
};

//
