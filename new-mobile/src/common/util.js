import { CSSTransition } from 'react-transition-group';
import React from 'react';

export const Component = ({ classNames, match, timeout = 500, item }) => {
  return (
    <CSSTransition
      in={match !== null}
      classNames={classNames}
      timeout={timeout}
      mountOnEnter
      unmountOnExit
    >
      {item && item()}
    </CSSTransition>
  );
};
