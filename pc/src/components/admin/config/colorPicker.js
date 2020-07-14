import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';

import styles from './index.less';
export const ColorPicker = props => {
  const { color: resColor = '' } = props;
  const rgbaString = resColor.replace(/rgba+|\(+|\)/g, '');
  const rgbaArr = rgbaString.split(',');
  const [r, g, b, a] = rgbaArr;
  const rgbaObj = {
    r,
    g,
    b,
    a,
  };
  const [state, setState] = useState({
    color: props.color,
    visible: false,
    rgb: rgbaObj,
  });

  const onChange = ({ rgb, hex }) => {
    const { r, g, b, a } = rgb;
    setState({
      ...state,
      color: `rgba(${r},${g},${b},${a})`,
      hex,
      rgb,
    });
  };

  useEffect(
    () => {
      const { setFieldsValue, code } = props;
      const {
        rgb: { r, g, b, a },
      } = state;
      setFieldsValue({ [code]: `rgba(${r},${g},${b},${a})` });
    },
    [state.rgb]
  );

  const handleEvent = e => e.stopPropagation();

  const { visible, color, rgb } = state;
  return (
    <div>
      <div
        style={{ background: color }}
        className={styles.colorDisplay}
        onClick={() => setState({ ...state, visible: true })}
      />
      {visible && (
        <div
          className={styles.colorPickerContainer}
          onClick={() => setState({ ...state, visible: false })}
        >
          <div className={styles.colorPicker} onClick={handleEvent}>
            <SketchPicker color={rgb} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  );
};
