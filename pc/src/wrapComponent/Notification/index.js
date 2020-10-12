import React, { useRef, useState } from 'react';
import { useDidMount } from '@/utils/hooks';
import { mapColor, mapIcon } from './constant';
import { positionStyle, createMountNode, delay, removeDom } from './util';
import './index.css';

const Notification = {};

const setInstance = () => {
  ['success', 'fail', 'warning', 'error'].forEach((_type_) => {
    const key = _type_;
    Notification[_type_] = (args) => Component(args, key);
  });
};

setInstance();

const Component = (props, _type_) => {
  const { position = 'top', msg = '通知', duration = 4 } = props;
  const WrapCom = (props) => {
    const [state, setState] = useState({ show: true });
    const ref = useRef(null);
    useDidMount(async () => {
      await delay(duration);
      await setState({ show: false });
      await delay(0.9);
      removeDom(ref.current);
    });
    const { show } = state;
    return (
      <div data-position={position} ref={ref} className="con">
        <div className={'toast ' + positionStyle(position, show).toast}>
          <i
            style={{ color: mapColor[_type_] }}
            className={'status iconfont ' + mapIcon[_type_]}
          />
          <span>{msg}</span>
        </div>
      </div>
    );
  };
  createMountNode(<WrapCom />, position);
};

export default Notification;
